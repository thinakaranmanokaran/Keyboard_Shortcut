// Minimal TypeScript declarations

export type ShortcutOptions = {
  /** Allow trigger when focus is inside input/textarea/contenteditable */
  allowInInputs?: boolean;
  /** call event.preventDefault() before calling handler */
  preventDefault?: boolean;
  /** call event.stopPropagation() before calling handler */
  stopPropagation?: boolean;
  /** allow repeated keydown events (holding key) */
  allowRepeat?: boolean;
};

export type ShortcutId = number;

export function addShortcut(
  keys: string | string[],
  handler: (e: KeyboardEvent) => any,
  options?: ShortcutOptions
): () => void;

export const on: typeof addShortcut;

export function removeShortcut(idOrKeysOrHandler: number | string | string[] | ((e: KeyboardEvent)=>any)): void;

export function clearShortcuts(): void;

export function enable(): void;

export function disable(): void;

// React hook (import from "keyboard-shortcutx/react")
export function useShortcut(
  keys: string | string[],
  handler: (e: KeyboardEvent) => any,
  options?: ShortcutOptions
): void;
