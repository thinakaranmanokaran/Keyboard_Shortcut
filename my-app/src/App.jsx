import React from "react";
import { addShortcut, on, clearShortcuts } from "keyboard-shortcutx";

export default function App() {
    const [enabled, setEnabled] = React.useState(true);
    const [lastKey, setLastKey] = React.useState("None");

    React.useEffect(() => {
        const link = document.createElement("link");
        link.href =
            "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        const handleKeyDown = (e) => {
            const keysSet = new Set();
            if (e.ctrlKey) keysSet.add("Ctrl");
            if (e.shiftKey) keysSet.add("Shift");
            if (e.altKey) keysSet.add("Alt");
            if (e.metaKey) keysSet.add("Meta");

            if (
                e.key !== "Control" &&
                e.key !== "Shift" &&
                e.key !== "Alt" &&
                e.key !== "Meta"
            ) {
                const mainKey = e.key.length === 1 ? e.key.toUpperCase() : e.key;
                keysSet.add(mainKey);
            }

            setLastKey(Array.from(keysSet).join("+"));
        };

        window.addEventListener("keydown", handleKeyDown);

        const off1 = addShortcut("ctrl+k", () => {
            setEnabled((prev) => !prev);
        });

        const off2 = on("shift+alt+h", () => {
            console.log("Hello from Shift+Alt+H");
        });

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            off1();
            off2();
            clearShortcuts();
            document.head.removeChild(link);
        };
    }, []);

    return (
        <div
            className="min-h-screen flex flex-col tracking-tighter items-center justify-center p-6 bg-[#FBECB2]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
            <h1 className="text-6xl font-extrabold  mb-8 text-black tracking-[-4px] ">
                Keyboard ShortcutX
            </h1>

            <div className="mb-8 w-full max-w-md text-center p-6 bg-gray-100 border-4 border-black rounded-xl shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
                <p className="text-xl mb-3 font-bold text-black">Last Key Pressed:</p>
                <div className="text-3xl font-mono font-black text-white bg-[#FF5F00] py-4 px-8 rounded-lg shadow-[6px_6px_0_0_rgba(0,0,0,1)] border-4 border-black mb-6">
                    {lastKey}
                </div>
                <a href="https://www.npmjs.com/package/keyboard-shortcutx" target="_blank" rel="noopener noreferrer" className="text-xl underline hover:bg-blue-400 px-4 py-2 rounded-xl transition-all duration-300 ">Package</a>
            </div>

            <button
                disabled={!enabled}
                className={`px-8 py-4 text-xl font-bold rounded-lg border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all duration-150 ${enabled
                        ? "bg-pink-500 hover:bg-pink-600 text-white"
                        : "bg-gray-400 text-gray-900 cursor-not-allowed"
                    }`}
            >
                {enabled ? "I am Enabled ✅" : "I am Disabled ❌"}
            </button>

            <p className="mt-12 text-center text-black font-semibold flex space-x-6">
                <span className="bg-[#FFEB55] p-4 border-2 rounded-lg shadow-[4px_4px_0px] shadow-black  ">Press <b>Ctrl+K</b> to toggle the button <br /></span>
                <span className="bg-[#FFEB55] p-4 border-2 rounded-lg shadow-[4px_4px_0px] shadow-black  ">Press <b>Shift+Alt+H</b> to log a message in console</span>
            </p>
        </div>
    );
}
