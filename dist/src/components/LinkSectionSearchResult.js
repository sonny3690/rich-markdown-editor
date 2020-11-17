"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
const smooth_scroll_into_view_if_needed_1 = __importDefault(require("smooth-scroll-into-view-if-needed"));
const styled_components_1 = __importDefault(require("styled-components"));
function LinkSectionSearchResult(_a) {
    var { title, subtitle, selected, icon, children } = _a, rest = __rest(_a, ["title", "subtitle", "selected", "icon", "children"]);
    const ref = React.useCallback((node) => {
        if (selected && node) {
            smooth_scroll_into_view_if_needed_1.default(node, {
                scrollMode: "if-needed",
                block: "center",
                boundary: (parent) => {
                    return parent.id !== "link-search-results";
                },
            });
        }
    }, [selected]);
    return (React.createElement(ListItem, Object.assign({ ref: ref, compact: !subtitle, selected: selected }, rest),
        React.createElement(IconWrapper, null, icon),
        React.createElement("div", null,
            React.createElement(Title, null, title),
            subtitle ? React.createElement(Subtitle, { selected: selected }, subtitle) : null,
            children && ">")));
}
const IconWrapper = styled_components_1.default.span `
  flex-shrink: 0;
  margin-right: 4px;
  opacity: 0.8;
`;
const ListItem = styled_components_1.default.li `
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 2px;
  color: ${(props) => props.theme.toolbarItem};
  background: ${(props) => props.selected ? props.theme.toolbarHoverBackground : "transparent"};
  font-family: ${(props) => props.theme.fontFamily};
  text-decoration: none;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  line-height: ${(props) => (props.compact ? "inherit" : "1.2")};
  height: ${(props) => (props.compact ? "28px" : "auto")};
`;
const Title = styled_components_1.default.div `
  font-size: 14px;
  font-weight: 500;
`;
const Subtitle = styled_components_1.default.div `
  font-size: 13px;
  opacity: ${(props) => (props.selected ? 0.75 : 0.5)};
`;
exports.default = LinkSectionSearchResult;
//# sourceMappingURL=LinkSectionSearchResult.js.map