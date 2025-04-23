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
        
        // Add custom styles
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            .emote-replacer-heading {
                color: var(--text-accent);
                margin-top: 1.5em;
                margin-bottom: 0.8em;
                font-size: 1.3em;
                border-bottom: 1px solid var(--text-accent-hover);
                padding-bottom: 0.4em;
            }
            
            .emote-replacer-section {
                margin-bottom: 1.5em;
                padding: 1em;
                border-radius: 8px;
                background-color: var(--background-secondary-alt);
            }
            
            .emote-preview {
                height: 2em;
                margin-left: 10px;
                border-radius: 4px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            
            .emote-preview-btn {
                color: var(--text-accent);
            }
            
            .emote-remove-btn {
                color: var(--text-error);
            }
            
            .emote-add-btn {
                background-color: var(--interactive-accent) !important;
            }
            
            .emote-divider {
                margin: 2em 0;
                border: none;
                height: 1px;
                background: linear-gradient(to right, transparent, var(--text-accent), transparent);
            }
        `;
        containerEl.appendChild(styleEl);
        
        // Section for existing emotes
        const emoteSection = containerEl.createDiv({ cls: 'emote-replacer-section' });
        emoteSection.createEl("h3", { text: "Current Emotes", cls: 'emote-replacer-heading' });
        
        const emoteEntries = Object.entries(this.plugin.settings.emotes);
        
        if (emoteEntries.length === 0) {
            emoteSection.createEl("p", { text: "No emotes configured yet. Add one below!" });
        } else {
            // Loop through current emotes and display as settings
            emoteEntries.forEach(([keyword, url], index) => {
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
                            .setClass("emote-preview-btn")
                            .onClick(() => {
                                // Remove any existing preview
                                const existingPreview = setting.settingEl.querySelector(".emote-preview");
                                if (existingPreview) existingPreview.remove();
                                
                                // Create and add new preview
                                const preview = document.createElement("img");
                                preview.src = url;
                                preview.className = "emote-preview";
                                setting.settingEl.appendChild(preview);
                            });
                    })
                    .addButton((btn) => {
                        btn.setButtonText("Remove")
                            .setTooltip("Remove this emote")
                            .setClass("emote-remove-btn")
                            .onClick(async () => {
                                delete this.plugin.settings.emotes[keyword];
                                await this.plugin.saveSettings();
                                this.display(); // Refresh the settings tab
                            });
                    });
                
                // Add separator between emotes (but not after the last one)
                if (index < emoteEntries.length - 1) {
                    setting.settingEl.style.paddingBottom = "0.8em";
                    setting.settingEl.style.borderBottom = "1px dashed var(--background-modifier-border)";
                    setting.settingEl.style.marginBottom = "0.8em";
                }
            });
        }

        // Add separator between sections
        containerEl.createEl("hr", { cls: "emote-divider" });

        // Section for adding new emotes
        const newEmoteSection = containerEl.createDiv({ cls: 'emote-replacer-section' });
        newEmoteSection.createEl("h3", { text: "Add New Emote", cls: 'emote-replacer-heading' });
        
        let newKeyword = "";
        let newUrl = "";
        
        new Setting(newEmoteSection)
            .setName("Emote Keyword")
            .setDesc("The text that will be replaced with an image (e.g., :peepoHappy:)")
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
                   .setClass("emote-add-btn")
                   .onClick(async () => {
                       if (newKeyword && newUrl) {
                           this.plugin.settings.emotes[newKeyword] = newUrl;
                           await this.plugin.saveSettings();
                           this.display(); // Refresh the settings tab
                       } else {
                           // Show error notification
                           new Error("Both emote keyword and image URL are required");
                       }
                   })
            );
    }
}