/**
 * Vitest tests for keyboard-shortcutx
 * Run with: npx vitest
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { addShortcut, removeShortcut, clearShortcuts, enable, disable } from '../src/index.js';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { useShortcut } from '../src/react.js';

beforeEach(() => {
    clearShortcuts();
    enable();
    document.body.innerHTML = '';
});

afterEach(() => {
    clearShortcuts();
    cleanup();
});

function dispatchKey(opts = {}) {
    const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...opts });
    // dispatch on window (listener attaches to window)
    window.dispatchEvent(event);
    return event;
}

describe('keyboard-shortcutx core', () => {
    it('triggers ctrl+s combo', () => {
        const fn = vi.fn();
        addShortcut('ctrl+s', fn);
        dispatchKey({ key: 's', ctrlKey: true });
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('preventDefault works', () => {
        const fn = vi.fn();
        addShortcut('ctrl+p', fn, { preventDefault: true });
        const ev = dispatchKey({ key: 'p', ctrlKey: true });
        // event.preventDefault should make defaultPrevented true
        expect(ev.defaultPrevented).toBe(true);
        expect(fn).toHaveBeenCalled();
    });

    it('does not trigger when focus in input by default', () => {
        const fn = vi.fn();
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.focus();
        addShortcut('ctrl+u', fn); // default allowInInputs=false
        dispatchKey({ key: 'u', ctrlKey: true, target: input });
        expect(fn).not.toHaveBeenCalled();
    });

    it('allowInInputs true triggers inside input', () => {
        const fn = vi.fn();
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.focus();
        addShortcut('ctrl+u', fn, { allowInInputs: true });
        dispatchKey({ key: 'u', ctrlKey: true, target: input });
        expect(fn).toHaveBeenCalled();
    });

    it('removeShortcut by handler works', () => {
        const fn = vi.fn();
        addShortcut('ctrl+q', fn);
        removeShortcut(fn);
        dispatchKey({ key: 'q', ctrlKey: true });
        expect(fn).not.toHaveBeenCalled();
    });
});

describe('React hook useShortcut', () => {
    it('registers on mount and unregisters on unmount', async () => {
        const handler = vi.fn();
        function TestComp() {
            useShortcut('ctrl+k', handler);
            return React.createElement('div', null, 'ok');
        }
        const { unmount } = render(React.createElement(TestComp));
        dispatchKey({ key: 'k', ctrlKey: true });
        expect(handler).toHaveBeenCalledTimes(1);
        unmount();
        dispatchKey({ key: 'k', ctrlKey: true });
        expect(handler).toHaveBeenCalledTimes(1); // no new calls after unmount
    });
});
