// src/editorPlugin.ts

import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

class EmoteWidget extends WidgetType {
    constructor(public url: string) {
        super();
    }

    toDOM(): HTMLElement {
        const img = document.createElement("img");
        img.src = this.url;
        img.style.height = "1.4em";
        img.style.verticalAlign = "middle";
        return img;
    }

    ignoreEvent() {
        return true;
    }
}

export function emoteDecoratorPlugin(getEmotes: () => Record<string, string>) {
    return ViewPlugin.fromClass(class {
        decorations: DecorationSet;

        constructor(view: EditorView) {
            this.decorations = this.buildDecorations(view);
        }

        update(update: ViewUpdate) {
            if (update.docChanged || update.viewportChanged) {
                this.decorations = this.buildDecorations(update.view);
            }
        }

        buildDecorations(view: EditorView): DecorationSet {
            const builder = new RangeSetBuilder<Decoration>();
            const text = view.state.doc.toString();
            const emotes = getEmotes(); // Get current emotes from plugin settings
        
            // First collect all matches to sort them later
            const allMatches = [];
            
            for (const [keyword, url] of Object.entries(emotes)) {
                // Create a new regex for each keyword to avoid state issues
                const regex = new RegExp(keyword.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), "g");
                
                // Reset regex and find all matches
                let match;
                while ((match = regex.exec(text)) !== null) {
                    allMatches.push({
                        from: match.index,
                        to: match.index + keyword.length,
                        url: url
                    });
                }
            }
            
            // Sort matches by position to ensure proper rendering
            // This prevents overlapping replacements
            allMatches.sort((a, b) => a.from - b.from);
            
            // Add decorations for all matches
            for (const match of allMatches) {
                builder.add(match.from, match.to, Decoration.replace({
                    widget: new EmoteWidget(match.url),
                    inclusive: false
                }));
            }
        
            return builder.finish();
        }
    }, {
        decorations: v => v.decorations
    });
}