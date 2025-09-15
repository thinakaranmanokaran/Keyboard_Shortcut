// React hook wrapper (kept separate so main runtime stays tiny).
import { useEffect } from 'react';
import { addShortcut } from './index.js';

// Minimal hook: auto-registers on mount and unregisters on unmount.
// Note: React is a peerDependency for consumers; tests use dev-installed react.
export function useShortcut(keys, handler, options) {
    useEffect(() => {
        const unregister = addShortcut(keys, handler, options);
        return () => {
            // unregister on unmount
            try { unregister(); } catch (e) { /* ignore */ }
        };
        // We stringify options so users can pass object literals; it's intentionally simple.
        // If you want finer control, pass memoized handler/options or dependencies.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keys, handler, JSON.stringify(options || {})]);
}
