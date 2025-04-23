// src/settings.ts

import { PluginSettingTab, Setting, App } from 'obsidian';
import EmoteReplacerPlugin from './main';

export default class EmoteReplacerSettingsTab extends PluginSettingTab {
    plugin: EmoteReplacerPlugin;

    constructor(app: App, plugin: EmoteReplacerPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();

        containerEl.createEl("h2", { text: "Emote Replacer Settings" });
        
        // Section for existing emotes
        const emoteSection = containerEl.createDiv();
        emoteSection.createEl("h3", { text: "Current Emotes" });

        // Loop through current emotes and display as settings
        Object.entries(this.plugin.settings.emotes).forEach(([keyword, url]) => {
            const setting = new Setting(emoteSection)
                .setName(keyword)
                .addText((text) =>
                    text
                        .setValue(url)
                        .onChange(async (value) => {
                            // Update the emote URL in settings
                            this.plugin.settings.emotes[keyword] = value;
                            await this.plugin.saveSettings();
                        })
                )
                .addButton((btn) => {
                    btn.setButtonText("Preview")
                        .setTooltip("Preview this emote")
                        .onClick(() => {
                            // Remove any existing preview
                            const existingPreview = setting.settingEl.querySelector(".emote-preview");
                            if (existingPreview) existingPreview.remove();
                            
                            // Create and add new preview
                            const preview = document.createElement("img");
                            preview.src = url;
                            preview.className = "emote-preview";
                            preview.style.height = "2em";
                            preview.style.marginLeft = "10px";
                            setting.settingEl.appendChild(preview);
                        });
                })
                .addButton((btn) => {
                    btn.setButtonText("Remove")
                        .setTooltip("Remove this emote")
                        .onClick(async () => {
                            delete this.plugin.settings.emotes[keyword];
                            await this.plugin.saveSettings();
                            this.display(); // Refresh the settings tab
                        });
                });
        });

        // Add separator
        containerEl.createEl("hr");

        // Section for adding new emotes
        const newEmoteSection = containerEl.createDiv();
        newEmoteSection.createEl("h3", { text: "Add New Emote" });
        
        let newKeyword = "";
        let newUrl = "";
        
        new Setting(newEmoteSection)
            .setName("Emote Keyword")
            .setDesc("The text that will be replaced with an image (e.g., :smile:)")
            .addText(text => 
                text.onChange(value => {
                    newKeyword = value;
                })
            );
            
        new Setting(newEmoteSection)
            .setName("Image URL")
            .setDesc("URL to the image that will be displayed")
            .addText(text => 
                text.onChange(value => {
                    newUrl = value;
                })
            );
        
        new Setting(newEmoteSection)
            .addButton(btn => 
                btn.setButtonText("Add Emote")
                   .setCta()
                   .onClick(async () => {
                       if (newKeyword && newUrl) {
                           this.plugin.settings.emotes[newKeyword] = newUrl;
                           await this.plugin.saveSettings();
                           this.display(); // Refresh the settings tab
                       } else {
                           // Show error or notification that both fields are required
                           new Error("Both emote keyword and image URL are required.");
                       }
                   })
            );
    }
}