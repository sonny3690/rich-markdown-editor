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
const styled_components_1 = require("styled-components");
const ToolbarButton_1 = __importDefault(require("./ToolbarButton"));
const ToolbarSeparator_1 = __importDefault(require("./ToolbarSeparator"));
class Menu extends React.Component {
    render() {
        const { view, items } = this.props;
        const { state } = view;
        const Tooltip = this.props.tooltip;
        return (React.createElement("div", null, items.map((item, index) => {
            if (item.name === "separator" && item.visible !== false) {
                return React.createElement(ToolbarSeparator_1.default, { key: index });
            }
            if (item.visible === false || !item.icon) {
                return null;
            }
            const Icon = item.icon;
            const isActive = item.active ? item.active(state) : false;
            return (React.createElement(ToolbarButton_1.default, { key: index, onClick: () => item.name && this.props.commands[item.name](item.attrs), active: isActive },
                React.createElement(Tooltip, { tooltip: item.tooltip, placement: "top" },
                    React.createElement(Icon, { color: this.props.theme.toolbarItem }))));
        })));
    }
}
exports.default = styled_components_1.withTheme(Menu);
//# sourceMappingURL=Menu.js.map