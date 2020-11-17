"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const Node_1 = __importDefault(require("./Node"));
class Embed extends Node_1.default {
    get name() {
        return "embed";
    }
    get schema() {
        return {
            content: "inline*",
            group: "block",
            atom: true,
            attrs: {
                href: {},
                component: {},
                matches: {},
            },
            parseDOM: [{ tag: "iframe" }],
            toDOM: node => [
                "iframe",
                { src: node.attrs.href, contentEditable: false },
                0,
            ],
        };
    }
    component({ isEditable, isSelected, theme, node }) {
        const Component = node.attrs.component;
        return (React.createElement(Component, { attrs: node.attrs, isEditable: isEditable, isSelected: isSelected, theme: theme }));
    }
    commands({ type }) {
        return attrs => (state, dispatch) => {
            dispatch(state.tr.replaceSelectionWith(type.create(attrs)).scrollIntoView());
            return true;
        };
    }
    toMarkdown(state, node) {
        state.ensureNewLine();
        state.write("[" + state.esc(node.attrs.href) + "](" + state.esc(node.attrs.href) + ")");
        state.write("\n\n");
    }
    parseMarkdown() {
        return {
            node: "embed",
            getAttrs: token => ({
                href: token.attrGet("href"),
                matches: token.attrGet("matches"),
                component: token.attrGet("component"),
            }),
        };
    }
}
exports.default = Embed;
//# sourceMappingURL=Embed.js.map