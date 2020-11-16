import * as React from "react";
import { setTextSelection } from "prosemirror-utils";
import { EditorView } from "prosemirror-view";
import { Mark } from "prosemirror-model";
import {
  DocumentIcon,
  CloseIcon,
  PlusIcon,
  TrashIcon,
  OpenIcon,
} from "outline-icons";
import styled, { withTheme } from "styled-components";
import isUrl from "../lib/isUrl";
import theme from "../theme";
import Flex from "./Flex";
import Input from "./Input";
import ToolbarButton from "./ToolbarButton";
import LinkSearchResult from "./LinkSearchResult";
import baseDictionary from "../dictionary";
import LinkSectionSearchResult from "./LinkSectionSearchResult";

export type SearchResult = SearchResultDrawer | SearchResultItem;

type SearchResultItem = {
  name: string;
  subtitle?: string;
  id: string;
  children: undefined;
};

type SearchResultDrawer = SearchResultItem & {
  children: SearchResult[];
};

type Props = {
  mark?: Mark;
  from: number;
  to: number;
  tooltip: typeof React.Component | React.FC<any>;
  dictionary: typeof baseDictionary;
  onRemoveLink?: () => void;
  onCreateLink?: (title: string) => Promise<void>;
  onSearchSection?: (term: string) => Promise<SearchResult[]>;
  onSelectSection: ({
    result,
    from,
    to,
    context,
  }: {
    result: SearchResult;
    from: number;
    to: number;
    context: string[];
  }) => void;
  onClickLink: (href: string, event: MouseEvent) => void;
  onShowToast?: (message: string, code: string) => void;
  view: EditorView;
  theme: typeof theme;
};

type State = {
  results: {
    [keyword: string]: SearchResult[];
  };
  value: string;
  previousValue: string;
  selectedIndex: number;
};

class LinkSectionEditor extends React.Component<Props, State> {
  discardInputValue = false;
  initialValue = this.href;
  initialSelectionLength = this.props.to - this.props.from;

  state: State = {
    selectedIndex: -1,
    value: this.href,
    previousValue: "",
    results: {},
  };

  searchContext: string[] = [];

  get href(): string {
    return this.props.mark ? this.props.mark.attrs.href : "";
  }

  get suggestedLinkTitle(): string {
    const { state } = this.props.view;
    const { value } = this.state;
    const selectionText = state.doc.cut(
      state.selection.from,
      state.selection.to
    ).textContent;

    return value.trim() || selectionText.trim();
  }

  componentDidMount = async () => {
    if (this.props.onSearchSection) {
      const results = await this.props.onSearchSection("");
      this.updateSearchResults(results, "");
    }
  };

  componentWillUnmount = () => {
    // If we discarded the changes then nothing to do
    if (this.discardInputValue) {
      return;
    }

    // If the link is the same as it was when the editor opened, nothing to do
    if (this.state.value === this.initialValue) {
      return;
    }

    // If the link is totally empty or only spaces then remove the mark
    const href = (this.state.value || "").trim();
    if (!href) {
      return this.handleRemoveLink();
    }

    // skip it for now, not sure what it does
    // this.save(href, href);
  };

  save = (result: SearchResult): void => {
    console.log("hit save with result", result);
    const query = result.url.trim();

    if (query.length === 0) return;

    this.discardInputValue = true;
    const { from, to } = this.props;

    this.searchContext.push(query);

    // this is where we process our link and metadata
    this.props.onSelectSection({
      result,
      from,
      to,
      context: this.searchContext,
    });
  };

  handleKeyDown = (event: React.KeyboardEvent): void => {
    switch (event.key) {
      case "Enter": {
        event.preventDefault();
        const { selectedIndex, value } = this.state;
        const results = this.state.results[value] || [];
        const { onCreateLink } = this.props;

        if (selectedIndex >= 0) {
          const result = results[selectedIndex];
          if (result) {
            // save the result
            this.save(result);
          } else if (onCreateLink && selectedIndex === results.length) {
            // otherwise we create
            this.handleCreateLink(this.suggestedLinkTitle);
          }
        } else {
          // this behavior shouldn't happen
          // // saves the raw input as href
          // this.save(value, value);
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
        } else {
          this.handleRemoveLink();
        }
        return;
      }

      case "ArrowUp": {
        if (event.shiftKey) return;
        event.preventDefault();
        event.stopPropagation();
        const prevIndex = this.state.selectedIndex - 1;

        this.setState({
          selectedIndex: Math.max(-1, prevIndex),
        });
        return;
      }

      case "ArrowDown":
        if (event.shiftKey) return;
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

  handleFocusLink = (selectedIndex: number) => {
    this.setState({ selectedIndex });
  };

  updateSearchResults = (results: SearchResult[], previousValue: string) => {
    this.setState((state) => ({
      results: {
        ...state.results,
        [previousValue]: results,
      },
      previousValue,
    }));
  };

  handleChange = async (event): Promise<void> => {
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
      } catch (error) {
        console.error(error);
      }
    }
  };

  handleOpenLink = (event): void => {
    event.preventDefault();
    this.props.onClickLink(this.href, event);
  };

  handleCreateLink = (value: string) => {
    this.discardInputValue = true;
    const { onCreateLink } = this.props;

    value = value.trim();
    if (value.length === 0) return;

    if (onCreateLink) return onCreateLink(value);
  };

  handleRemoveLink = (): void => {
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

  processNewItems = (): void => {};

  handleSelectSection = (selectedResult: SearchResult) => async (event) => {
    event.preventDefault();
    this.save(selectedResult);

    const { url } = selectedResult;

    const res = {};

    // if (res.type === "items") {
    //   // process more items
    // } else {
    //   // keep them together
    //   console.log("shouldnt reach for now ");
    // }
  };

  moveSelectionToEnd = () => {
    const { to, view } = this.props;
    const { state, dispatch } = view;
    dispatch(setTextSelection(to)(state.tr));
    view.focus();
  };

  render() {
    const { dictionary, theme } = this.props;
    const { value, selectedIndex } = this.state;

    const results =
      this.state.results[value.trim()] ||
      this.state.results[this.state.previousValue] ||
      [];

    const Tooltip = this.props.tooltip;
    const looksLikeUrl = value.match(/^https?:\/\//i);

    const suggestedLinkTitle = this.suggestedLinkTitle;

    const showCreateLink =
      !!this.props.onCreateLink &&
      !(suggestedLinkTitle === this.initialValue) &&
      suggestedLinkTitle.length > 0 &&
      !looksLikeUrl;

    const showResults =
      (!!suggestedLinkTitle && showCreateLink) || results.length >= 0;
    // !!suggestedLinkTitle && (showCreateLink || results.length >= 0);

    return (
      <Wrapper>
        <Input
          value={value}
          placeholder={dictionary.searchSection}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          autoFocus={this.href === ""}
        />
        <ToolbarButton onClick={this.handleOpenLink} disabled={!value}>
          <Tooltip tooltip={dictionary.openLink} placement="top">
            <OpenIcon color={theme.toolbarItem} />
          </Tooltip>
        </ToolbarButton>
        <ToolbarButton onClick={this.handleRemoveLink}>
          <Tooltip tooltip={dictionary.removeLink} placement="top">
            {this.initialValue ? (
              <TrashIcon color={theme.toolbarItem} />
            ) : (
              <CloseIcon color={theme.toolbarItem} />
            )}
          </Tooltip>
        </ToolbarButton>
        <SearchResults id="link-search-results">
          {results.map((result, index) => (
            <LinkSectionSearchResult
              key={result.id}
              title={result.name}
              subtitle={result.subtitle}
              children={result.children}
              icon={<DocumentIcon color={theme.toolbarItem} />}
              onMouseOver={() => this.handleFocusLink(index)}
              onClick={this.handleSelectSection(result)}
              selected={index === selectedIndex}
            />
          ))}
        </SearchResults>
        {/* )} */}
      </Wrapper>
    );
  }
}

const Wrapper = styled(Flex)`
  margin-left: -8px;
  margin-right: -8px;
  min-width: 336px;
`;

const SearchResults = styled.ol`
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

export default withTheme(LinkSectionEditor);
