# keyboard-shortcutx

<p align="center">
  <a href="https://thinakaranmanokaran.github.io/Keyboard_Shortcut/">
    <img src="https://thinakaranmanokaran.github.io/Keyboard_Shortcut/favicon512.png" 
         alt="keyboard-shortcutx logo" 
         width="256" 
         height="258" />
  </a>
</p>


<p align="center">
Lightweight, dependency-free keyboard shortcut & hotkey manager for JavaScript and React.  
ESM-first, tiny footprint, and designed for modern apps.
</p>

---

## 🚀 Features

* ⚡ **Super lightweight** (no dependencies)
* 🎯 **Simple API** (`addShortcut`, `on`, `clearShortcuts`)
* 🔄 **Works everywhere** (vanilla JS, React, SPA frameworks)
* 🪝 **React hook support** for component-level shortcuts
* 📦 **ESM-first** build with CommonJS fallback
* ✅ **Tested with JSDOM + Vitest**

---

## 🚀 Preview

[<img src="https://thinakaranmanokaran.github.io/Keyboard_Shortcut/preview.png" alt="keyboard-shortcutx preview" />](https://thinakaranmanokaran.github.io/Keyboard_Shortcut/)

---

## 📦 Installation

```bash
npm install keyboard-shortcutx
# or
yarn add keyboard-shortcutx
```

---

## 🖥️ Usage

### React Example

```jsx
import React from "react";
import { addShortcut, on, clearShortcuts } from "keyboard-shortcutx";

export default function App() {
    const [enabled, setEnabled] = React.useState(true);

    React.useEffect(() => {
        // Toggle button enable/disable with Ctrl+K
        const off1 = addShortcut("ctrl+k", () => {
            setEnabled((prev) => !prev);
        });

        // Log something with Shift+Alt+H
        const off2 = on("shift+alt+h", () => {
            console.log("Hello from Shift+Alt+H");
        });

        return () => {
            off1();
            off2();
            clearShortcuts();
        };
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Keyboard ShortcutX Demo</h1>
            <button disabled={!enabled}>
                {enabled ? "I am Enabled ✅" : "I am Disabled ❌"}
            </button>
            <p>
                Press <b>Ctrl+K</b> to toggle the button <br />
                Press <b>Shift+Alt+H</b> to log a message in console
            </p>
        </div>
    );
}
```

### Vanilla JavaScript Example

```js
import { addShortcut } from "keyboard-shortcutx";

// Show alert on Ctrl+S
addShortcut("ctrl+s", (e) => {
  e.preventDefault();
  alert("Save triggered!");
});
```

---

## 📖 API

### `addShortcut(keys, callback)`

Registers a shortcut. Returns an **unsubscribe function**.

### `on(keys, callback)`

Alias for `addShortcut`.

### `clearShortcuts()`

Clears all registered shortcuts.

---

## 🔑 Supported Key Combos

* `ctrl`, `shift`, `alt`, `meta` (⌘ on Mac)
* Any character key (`a`, `b`, `1`, etc.)
* Function keys (`f1`…`f12`)
* Arrow keys, `enter`, `escape`, `tab`, `space`

Example: `ctrl+shift+s`, `alt+h`, `meta+enter`

---

## 📊 Roadmap

* [ ] Support for sequences (`g g` like Vim)
* [ ] Scoped shortcuts per element
* [ ] Built-in React hook (`useShortcut`)

---

## 📚 Resources

* [GitHub Repository](https://github.com/thinakaranmanokaran/Keyboard_Shortcut)
* [NPM Package](https://www.npmjs.com/package/keyboard-shortcutx)
* [Portfolio](https://thinakaran.dev)
* [Live Demo](https://thinakaranmanokaran.github.io/Keyboard_Shortcut/)

---

## 🤝 Contributing

Contributions are welcome! Please open issues and pull requests on [GitHub](https://github.com/thinakaranmanokaran/Keyboard_Shortcut).

---

## 📜 License

[MIT License](/LICENSE)

---

## 👤 Author

[Thinakaran Manokaran](https://thinakaran.dev)

Portfolio : [thinakaran.dev](https://thinakaran.dev)

---

### 🔎 SEO Keywords

`keyboard shortcut`, `hotkey manager`, `react hook`, `javascript shortcuts`, `keybinding library`, `keyboard events`, `tiny hotkey lib`, `universal hotkeys`, `keyboard-shortcutx`

---