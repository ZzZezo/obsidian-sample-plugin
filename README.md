# 🧩 Emote Replacer Plugin for Obsidian

Replace text shortcuts like `:peepoHappy:` or `:monkaS:` with custom images or GIFs in both **edit** and **preview** modes — just like 7TV/Twitch-style emotes.

---

## 🚀 Features

- 🔁 Replaces custom keywords with images or GIFs inline
- ⚙️ Manage emotes directly from the settings panel
- ✨ Works in both **edit** and **preview** modes
- 💾 Settings are saved and persist across sessions

---

## 📦 Installation

> **⚠️ This is a developer plugin! You'll need to enable Developer Mode in Obsidian.**

1. Clone or download this repo into your Obsidian vault’s `.obsidian/plugins/` directory.
2. Run `npm install` inside the plugin folder.
3. Build it: `npm run build`
4. Open Obsidian, go to **Settings > Community Plugins**, and enable **Developer Mode**.
5. Load the plugin from **Settings > Community Plugins > Reload plugins** or toggle it on.

---

## 🛠️ Usage

### 📋 Add or Edit Emotes

1. Open **Settings > Emote Replacer**.
2. Use the "Add Emote" button to add a new keyword and image URL.
3. Modify existing emote URLs by editing the input fields directly.

### 💡 Example

| Keyword         | Result                                      |
|-----------------|---------------------------------------------|
| `:peepoHappy:`  | ![peepoHappy](https://cdn.7tv.app/emote/01F6RC8C1G0003SBEQ3QZTEE99/4x.avif) |
| `:monkaS:`      | ![monkaS]([https://cdn.7tv.app/emote/abcde1234.gif](https://cdn.7tv.app/emote/01F78CHJ2G0005TDSTZFBDGMK4/4x.avif))     |

---

## 🧠 How It Works

- In **preview mode**, the plugin scans rendered HTML and replaces keywords with `<img>` tags.
- In **edit mode**, it uses CodeMirror decorations to inject images inline with your text.

---

## 📥 Roadmap / Ideas

- 🔍 Autocomplete for emotes while typing
- 🌈 Inline picker for adding new emotes
- 🔄 Sync emotes with 7TV/BTTV/FFZ APIs
- 🧼 Remove emotes via UI
- 🖼️ Toggle between showing/hiding emotes


## 📃 License

MIT – go wild, fork it, mod it, break it, improve it ✨

---

## 🤙 Credits

Built by Erik. Inspired by Twitch/7TV-style chat overlays.

---
