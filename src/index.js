// Core runtime: dependency-free, ESM, SSR-safe.
// Exports: addShortcut (alias on), removeShortcut, clearShortcuts, enable, disable

// Internal state (kept in module scope)
let nextId = 1;
const idMap = new Map(); // id -> { keys: [normKey], handler, options }
const comboMap = new Map(); // normKey -> Set(id)
let listenerAttached = false;
let enabled = true;

// Helpers
const MOD_ORDER = ['ctrl', 'alt', 'shift', 'meta'];

function isElementInput(el) {
    if (!el || typeof el !== 'object') return false;
    const tag = (el.tagName || '').toUpperCase();
    if (tag === 'INPUT' || tag === 'TEXTAREA') return true;
    if (el.isContentEditable) return true;
    return false;
}

function resolvePlatformMod() {
    if (typeof navigator !== 'undefined' && navigator.platform) {
        return /Mac|iPhone|iPad|iPod/.test(navigator.platform) ? 'meta' : 'ctrl';
    }
    // SSR fallback: choose ctrl (safe default)
    return 'ctrl';
}

// Normalizes a single token or key name
function normalizeKeyToken(tok) {
    if (!tok) return '';
    tok = tok.trim().toLowerCase();
    // aliases
    if (tok === 'cmd') return 'meta';
    if (tok === 'command') return 'meta';
    if (tok === 'control') return 'ctrl';
    if (tok === 'option') return 'alt';
    if (tok === 'escape') return 'esc';
    if (tok === 'del') return 'delete';
    if (tok === 'mod') return resolvePlatformMod();
    if (tok === 'plus') return '+';
    if (tok === 'spacebar') return 'space';
    if (tok === 'return') return 'enter';
    return tok;
}

// Normalize a combo string like "Ctrl+Shift+K" -> "ctrl+shift+k"
// Accepts modifier-only combos too (e.g., "ctrl+shift")
function normalizeCombo(input) {
    if (!input && input !== '') return '';
    // if it's already an array or something unexpected, coerce to string
    const s = String(input);
    const parts = s.split('+').map(p => p.trim()).filter(Boolean).map(normalizeKeyToken);
    const mods = new Set();
    let key = '';
    for (const p of parts) {
        if (['ctrl', 'alt', 'shift', 'meta'].includes(p)) mods.add(p);
        else key = p;
    }
    const modList = MOD_ORDER.filter(m => mods.has(m));
    return modList.length ? (key ? `${modList.join('+')}+${key}` : `${modList.join('+')}`) : (key || '');
}

function eventToCombo(e) {
    if (!e) return '';
    if (e.isComposing) return ''; // IME composition — ignore
    // collect modifiers
    const mods = [];
    if (e.ctrlKey) mods.push('ctrl');
    if (e.altKey) mods.push('alt');
    if (e.shiftKey) mods.push('shift');
    if (e.metaKey) mods.push('meta');

    // normalize key name
    let key = String(e.key || '').toLowerCase();
    if (key === ' ') key = 'space';
    if (key === 'spacebar') key = 'space';
    if (key === 'esc') key = 'esc';
    if (key === 'arrowleft') key = 'left';
    if (key === 'arrowright') key = 'right';
    if (key === 'arrowup') key = 'up';
    if (key === 'arrowdown') key = 'down';
    if (key === 'delete' || key === 'del') key = 'delete';
    if (key === 'control') key = 'ctrl';
    if (['ctrl', 'alt', 'shift', 'meta'].includes(key)) {
        // modifier key pressed alone — return modifiers only
        return [...new Set(mods)].join('+');
    }
    const modList = MOD_ORDER.filter(m => mods.includes(m));
    return modList.length ? `${modList.join('+')}+${key}` : key;
}

// Listener management
function attachListener() {
    if (listenerAttached) return;
    if (typeof window === 'undefined') return; // SSR-safe
    window.addEventListener('keydown', handleKeydown, true);
    listenerAttached = true;
}

function detachListener() {
    if (!listenerAttached) return;
    if (typeof window === 'undefined') return;
    window.removeEventListener('keydown', handleKeydown, true);
    listenerAttached = false;
}

function handleKeydown(e) {
    if (!enabled) return;
    if (e.isComposing) return;

    const combo = eventToCombo(e);
    if (!combo) return;

    const ids = comboMap.get(combo);
    if (!ids || ids.size === 0) return;

    // Determine if focus is in an input-like element
    const target = e.target;
    const inInput = isElementInput(target);

    // Run handlers — respect each handler's options
    for (const id of Array.from(ids)) {
        const entry = idMap.get(id);
        if (!entry) continue;
        const { handler, options = {} } = entry;
        const {
            allowInInputs = false,
            preventDefault = false,
            stopPropagation = false,
            allowRepeat = false
        } = options;

        if (inInput && !allowInInputs) continue;
        if (!allowRepeat && e.repeat) continue;

        if (preventDefault) e.preventDefault();
        if (stopPropagation) e.stopPropagation();

        try {
            handler(e);
        } catch (err) {
            // swallow to avoid breaking other handlers; user-level errors should be handled by consumer
            // keep minimal for size reasons
            // eslint-disable-next-line no-console
            console.error('keyboard-shortcutx handler error:', err);
        }
    }
}

// API
export function addShortcut(keys, handler, options = {}) {
    if (!keys) throw new Error('addShortcut: keys required');
    if (typeof handler !== 'function') throw new Error('addShortcut: handler must be a function');

    const id = nextId++;
    const keyList = Array.isArray(keys) ? keys : [keys];
    const normKeys = keyList.map(normalizeCombo);

    idMap.set(id, { keys: normKeys, handler, options });

    for (const k of normKeys) {
        const set = comboMap.get(k) || new Set();
        set.add(id);
        comboMap.set(k, set);
    }

    // lazy attach listener when first shortcut added
    attachListener();

    // return unregister function
    return () => removeShortcut(id);
}

// alias
export const on = addShortcut;

export function removeShortcut(idOrKeysOrHandler) {
    // remove by id
    if (typeof idOrKeysOrHandler === 'number') {
        const id = idOrKeysOrHandler;
        const entry = idMap.get(id);
        if (!entry) return;
        for (const k of entry.keys) {
            const set = comboMap.get(k);
            if (!set) continue;
            set.delete(id);
            if (set.size === 0) comboMap.delete(k);
        }
        idMap.delete(id);
    } else if (typeof idOrKeysOrHandler === 'function') {
        // remove by handler
        for (const [id, entry] of Array.from(idMap.entries())) {
            if (entry.handler === idOrKeysOrHandler) removeShortcut(id);
        }
    } else if (typeof idOrKeysOrHandler === 'string' || Array.isArray(idOrKeysOrHandler)) {
        // remove by key string or array of key strings
        const keys = Array.isArray(idOrKeysOrHandler) ? idOrKeysOrHandler : [idOrKeysOrHandler];
        for (const k of keys) {
            const nk = normalizeCombo(k);
            const set = comboMap.get(nk);
            if (!set) continue;
            for (const id of Array.from(set)) {
                // remove entry with this id
                removeShortcut(id);
            }
        }
    }

    // detach if nothing left
    if (idMap.size === 0) detachListener();
}

export function clearShortcuts() {
    idMap.clear();
    comboMap.clear();
    detachListener();
}

export function enable() {
    enabled = true;
}

export function disable() {
    enabled = false;
}

// Expose a small debug/info helper (not part of the 1st-class API, but handy)
export function _debug_state() {
    return {
        enabled,
        listenerAttached,
        ids: Array.from(idMap.keys()),
        combos: Array.from(comboMap.keys())
    };
}
