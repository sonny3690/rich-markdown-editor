"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isUrl(text) {
    try {
        new URL(text);
        return true;
    }
    catch (err) {
        return false;
    }
}
exports.default = isUrl;
//# sourceMappingURL=isUrl.js.map