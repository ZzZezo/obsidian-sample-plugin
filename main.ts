// src/main.ts

import { Plugin } from 'obsidian';
import { emoteDecoratorPlugin } from './editorPlugin';  // Import the emote editor plugin
import EmoteReplacerSettingsTab from './settings';  // Import settings tab class

interface EmoteReplacerSettings {
    emotes: Record<string, string>;
}

const DEFAULT_SETTINGS: EmoteReplacerSettings = {
    emotes: {
        ":peepoHappy:": "https://cdn.7tv.app/emote/01F6RC8C1G0003SBEQ3QZTEE99/4x.avif",
        ":smile:": "https://cdn.7tv.app/emote/01HFVS0P0G0001DJAN6MH02MTS/4x.avif"
    }
};

export default class EmoteReplacerPlugin extends Plugin {
    settings: EmoteReplacerSettings;

    async onload() {
        console.log("🎉 Emote Replacer Plugin loaded");

        // Load settings
        await this.loadSettings();

        // Register editor extension with a function to access current settings
        this.registerEditorExtension(emoteDecoratorPlugin(() => this.settings.emotes));

        // Register markdown postprocessor for Preview mode
        this.registerMarkdownPostProcessor((el) => {
            Object.entries(this.settings.emotes).forEach(([keyword, url]) => {
                el.querySelectorAll('p, li, span, strong, em, h1, h2, h3, h4').forEach(node => {
                    if (node.innerHTML.includes(keyword)) {
                        node.innerHTML = node.innerHTML.replaceAll(
                            keyword,
                            `<img src="${url}" style="height:1.4em; vertical-align:middle;">`
                        );
                    }
                });
            });
        });

        // Add settings tab
        this.addSettingTab(new EmoteReplacerSettingsTab(this.app, this));
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        // Force refresh of editor to show updated emotes
        this.app.workspace.updateOptions();
    }
}