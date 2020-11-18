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
const prosemirror_utils_1 = require("prosemirror-utils");
const outline_icons_1 = require("outline-icons");
const styled_components_1 = __importStar(require("styled-components"));
const Flex_1 = __importDefault(require("./Flex"));
const Input_1 = __importDefault(require("./Input"));
const ToolbarButton_1 = __importDefault(require("./ToolbarButton"));
const SectionSearchResult_1 = __importDefault(require("./SectionSearchResult"));
class LinkSectionEditor extends React.Component {
    constructor() {
        super(...arguments);
        this.discardInputValue = false;
        this.initialValue = this.href;
        this.initialSelectionLength = this.props.to - this.props.from;
        this.state = {
            selectedIndex: -1,
            value: this.href,
            previousValue: "",
            results: {},
        };
        this.searchContext = [];
        this.componentDidMount = async () => {
            if (this.props.onSearchSection) {
                const results = await this.props.onSearchSection("");
                this.updateSearchResults(results, "");
            }
        };
        this.componentWillUnmount = () => {
            if (this.discardInputValue) {
                return;
            }
            if (this.state.value === this.initialValue) {
                return;
            }
            const href = (this.state.value || "").trim();
            if (!href) {
                return this.handleRemoveLink();
            }
        };
        this.save = (result) => {
            this.discardInputValue = true;
            const { from, to } = this.props;
            this.props.onSelectSection({
                result,
                from,
                to,
                context: this.searchContext,
            });
        };
        this.handleKeyDown = (event) => {
            switch (event.key) {
                case "Enter": {
                    event.preventDefault();
                    const { selectedIndex, value } = this.state;
                    const results = this.state.results[value] || [];
                    const { onCreateLink } = this.props;
                    if (selectedIndex >= 0) {
                        const result = results[selectedIndex];
                        if (result) {
                            this.save(result);
                        }
                        else if (onCreateLink && selectedIndex === results.length) {
                            this.handleCreateLink(this.suggestedLinkTitle);
                        }
                    }
                    else {
                    }
                    if (this.initialSelectionLength) {
                        this.moveSelectionToEnd();
                    }
                    return;
                }
                case "Escape": {
                    event.preventDefault();
                    if (this.initialValue) {
                        this.setState({ value: this.initialValue }, this.moveSelectionToEnd);
                    }
                    else {
                        this.handleRemoveLink();
                    }
                    return;
                }
                case "ArrowUp": {
                    if (event.shiftKey)
                        return;
                    event.preventDefault();
                    event.stopPropagation();
                    const prevIndex = this.state.selectedIndex - 1;
                    this.setState({
                        selectedIndex: Math.max(-1, prevIndex),
                    });
                    return;
                }
                case "ArrowDown":
                    if (event.shiftKey)
                        return;
                case "Tab": {
                    event.preventDefault();
                    event.stopPropagation();
                    const { selectedIndex, value } = this.state;
                    const results = this.state.results[value] || [];
                    const total = results.length;
                    const nextIndex = selectedIndex + 1;
                    this.setState({
                        selectedIndex: Math.min(nextIndex, total),
                    });
                    return;
                }
            }
        };
        this.handleFocusLink = (selectedIndex) => {
            this.setState({ selectedIndex });
        };
        this.updateSearchResults = (results, previousValue) => {
            this.setState((state) => ({
                results: Object.assign(Object.assign({}, state.results), { [previousValue]: results }),
                previousValue,
            }));
        };
        this.handleChange = async (event) => {
            const value = event.target.value;
            this.setState({
                value,
                selectedIndex: -1,
            });
            console.log("chanigng value to", value);
            const trimmedValue = value.trim();
            if (this.props.onSearchSection) {
                try {
                    const results = await this.props.onSearchSection(trimmedValue);
                    this.updateSearchResults(results, trimmedValue);
                }
                catch (error) {
                    console.error(error);
                }
            }
        };
        this.handleOpenLink = (event) => {
            event.preventDefault();
            this.props.onClickLink(this.href, event);
        };
        this.handleCreateLink = (value) => {
            this.discardInputValue = true;
            const { onCreateLink } = this.props;
            value = value.trim();
            if (value.length === 0)
                return;
            if (onCreateLink)
                return onCreateLink(value);
        };
        this.handleRemoveLink = () => {
            this.discardInputValue = true;
            const { from, to, mark, view, onRemoveLink } = this.props;
            const { state, dispatch } = this.props.view;
            if (mark) {
                dispatch(state.tr.removeMark(from, to, mark));
            }
            if (onRemoveLink) {
                onRemoveLink();
            }
            view.focus();
        };
        this.processNewItems = () => { };
        this.handleSelectSection = (selectedResult) => async (event) => {
            event.preventDefault();
            this.save(selectedResult);
            const { id } = selectedResult;
            const res = {};
        };
        this.moveSelectionToEnd = () => {
            const { to, view } = this.props;
            const { state, dispatch } = view;
            dispatch(prosemirror_utils_1.setTextSelection(to)(state.tr));
            view.focus();
        };
    }
    get href() {
        return this.props.mark ? this.props.mark.attrs.href : "";
    }
    get suggestedLinkTitle() {
        const { state } = this.props.view;
        const { value } = this.state;
        const selectionText = state.doc.cut(state.selection.from, state.selection.to).textContent;
        return value.trim() || selectionText.trim();
    }
    render() {
        const { dictionary, theme } = this.props;
        const { value, selectedIndex } = this.state;
        const results = this.state.results[value.trim()] ||
            this.state.results[this.state.previousValue] ||
            [];
        const Tooltip = this.props.tooltip;
        const looksLikeUrl = value.match(/^https?:\/\//i);
        const suggestedLinkTitle = this.suggestedLinkTitle;
        const showCreateLink = !!this.props.onCreateLink &&
            !(suggestedLinkTitle === this.initialValue) &&
            suggestedLinkTitle.length > 0 &&
            !looksLikeUrl;
        const showResults = (!!suggestedLinkTitle && showCreateLink) || results.length >= 0;
        return (React.createElement(Wrapper, null,
            React.createElement(Input_1.default, { value: value, placeholder: dictionary.searchSection, onKeyDown: this.handleKeyDown, onChange: this.handleChange, autoFocus: this.href === "" }),
            React.createElement(ToolbarButton_1.default, { onClick: this.handleOpenLink, disabled: !value },
                React.createElement(Tooltip, { tooltip: dictionary.openLink, placement: "top" },
                    React.createElement(outline_icons_1.OpenIcon, { color: theme.toolbarItem }))),
            React.createElement(ToolbarButton_1.default, { onClick: this.handleRemoveLink },
                React.createElement(Tooltip, { tooltip: dictionary.removeLink, placement: "top" }, this.initialValue ? (React.createElement(outline_icons_1.TrashIcon, { color: theme.toolbarItem })) : (React.createElement(outline_icons_1.CloseIcon, { color: theme.toolbarItem })))),
            React.createElement(SearchResults, { id: "link-search-results" }, results.map((result, index) => (React.createElement(SectionSearchResult_1.default, { key: result.id, title: result.name, subtitle: result.subtitle, icon: React.createElement(outline_icons_1.DocumentIcon, { color: theme.toolbarItem }), onMouseOver: () => this.handleFocusLink(index), onClick: this.handleSelectSection(result), selected: index === selectedIndex }))))));
    }
}
const Wrapper = styled_components_1.default(Flex_1.default) `
  margin-left: -8px;
  margin-right: -8px;
  min-width: 336px;
`;
const SearchResults = styled_components_1.default.ol `
  background: ${(props) => props.theme.toolbarBackground};
  position: absolute;
  top: 100%;
  width: 100%;
  height: auto;
  left: 0;
  padding: 4px 8px 8px;
  margin: 0;
  margin-top: -3px;
  margin-bottom: 0;
  border-radius: 0 0 4px 4px;
  overflow-y: auto;
  max-height: 25vh;
`;
exports.default = styled_components_1.withTheme(LinkSectionEditor);
//# sourceMappingURL=SectionEditor.js.map