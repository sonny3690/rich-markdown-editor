"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const markdown_it_container_1 = __importDefault(require("markdown-it-container"));
function notice(md) {
    return markdown_it_container_1.default(md, "notice", {
        marker: ":",
        validate: () => true,
    });
}
exports.default = notice;
//# sourceMappingURL=notices.js.map