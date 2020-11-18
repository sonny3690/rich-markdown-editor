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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const React = __importStar(require("react"));
const FloatingToolbar_1 = __importDefault(require("./FloatingToolbar"));
const createAndInsertLink_1 = __importDefault(require("../commands/createAndInsertLink"));
const SectionEditor_1 = __importDefault(require("./SectionEditor"));
function isActive(props) {
    const { view } = props;
    const { selection } = view.state;
    const paragraph = view.domAtPos(selection.$from.pos);
    return props.isActive && !!paragraph.node;
}
class LinkSectionToolbar extends React.Component {
    constructor() {
        super(...arguments);
        this.menuRef = React.createRef();
        this.state = {
            left: -1000,
            top: undefined,
        };
        this.handleClickOutside = (ev) => {
            if (ev.target &&
                this.menuRef.current &&
                this.menuRef.current.contains(ev.target)) {
                return;
            }
            this.props.onClose();
        };
        this.handleOnCreateLink = async (title) => {
            const { dictionary, onCreateLink, view, onClose, onShowToast } = this.props;
            onClose();
            this.props.view.focus();
            if (!onCreateLink) {
                return;
            }
            const { dispatch, state } = view;
            const { from, to } = state.selection;
            assert_1.default(from === to);
            const href = `creating#${title}…`;
            dispatch(view.state.tr
                .insertText(title, from, to)
                .addMark(from, to + title.length, state.schema.marks.link.create({ href })));
            createAndInsertLink_1.default(view, title, href, {
                onCreateLink,
                onShowToast,
                dictionary,
            });
        };
        this.handleOnSelectLink = async ({ result, context, }) => {
            const [value, shouldClose] = await this.props.onQuerySectionResult(result, context);
            if (shouldClose === false) {
                return;
            }
            const { view, onClose, parser } = this.props;
            onClose();
            this.props.view.focus();
            const { dispatch, state } = view;
            const { from, to } = state.selection;
            assert_1.default(from === to);
            const paste = parser.parse(value.trim());
            const slice = paste.slice(0);
            const transaction = view.state.tr.replaceSelection(slice);
            view.dispatch(transaction);
        };
    }
    componentDidMount() {
        window.addEventListener("mousedown", this.handleClickOutside);
    }
    componentWillUnmount() {
        window.removeEventListener("mousedown", this.handleClickOutside);
    }
    render() {
        const _a = this.props, { onCreateLink, onClose } = _a, rest = __rest(_a, ["onCreateLink", "onClose"]);
        const selection = this.props.view.state.selection;
        return (React.createElement(FloatingToolbar_1.default, Object.assign({ ref: this.menuRef, active: isActive(this.props) }, rest), isActive(this.props) && (React.createElement(SectionEditor_1.default, Object.assign({ from: selection.from, to: selection.to, onCreateLink: onCreateLink ? this.handleOnCreateLink : undefined, onSelectSection: this.handleOnSelectLink, onRemoveLink: onClose }, rest)))));
    }
}
exports.default = LinkSectionToolbar;
//# sourceMappingURL=SectionToolbar.js.map