import { Plugin } from "prosemirror-state";
import Extension from "../lib/Extension";
export default class MarkdownPaste extends Extension {
    get name(): string;
    get plugins(): Plugin<any, any>[];
}
//# sourceMappingURL=MarkdownPaste.d.ts.map