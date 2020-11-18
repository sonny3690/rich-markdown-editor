import assert from "assert";
import * as React from "react";
import { EditorView } from "prosemirror-view";
import FloatingToolbar from "./FloatingToolbar";
import createAndInsertLink from "../commands/createAndInsertLink";
import baseDictionary from "../dictionary";
import LinkSectionEditor, { SearchResult } from "./SectionEditor";
import { MarkdownParser } from "prosemirror-markdown";

type Props = {
  isActive: boolean;
  view: EditorView;
  tooltip: typeof React.Component | React.FC<any>;
  dictionary: typeof baseDictionary;
  parser: MarkdownParser<any>;
  onCreateLink?: (title: string) => Promise<string>;
  onSearchSection?: (term: string) => Promise<SearchResult[]>;
  onClickLink: (href: string, event: MouseEvent) => void;
  onShowToast?: (msg: string, code: string) => void;
  onQuerySectionResult: (
    result: SearchResult,
    context: string[]
  ) => Promise<[string, boolean]>;
  onClose: () => void;
};

function isActive(props) {
  const { view } = props;
  const { selection } = view.state;

  const paragraph = view.domAtPos(selection.$from.pos);
  return props.isActive && !!paragraph.node;
}

export default class LinkSectionToolbar extends React.Component<Props> {
  menuRef = React.createRef<HTMLDivElement>();

  state = {
    left: -1000,
    top: undefined,
  };

  componentDidMount() {
    window.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    window.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (ev) => {
    if (
      ev.target &&
      this.menuRef.current &&
      this.menuRef.current.contains(ev.target)
    ) {
      return;
    }

    this.props.onClose();
  };

  handleOnCreateLink = async (title: string) => {
    const { dictionary, onCreateLink, view, onClose, onShowToast } = this.props;

    onClose();
    this.props.view.focus();

    if (!onCreateLink) {
      return;
    }

    const { dispatch, state } = view;
    const { from, to } = state.selection;
    assert(from === to);

    const href = `creating#${title}…`;

    // Insert a placeholder link
    dispatch(
      view.state.tr
        .insertText(title, from, to)
        .addMark(
          from,
          to + title.length,
          state.schema.marks.link.create({ href })
        )
    );

    createAndInsertLink(view, title, href, {
      onCreateLink,
      onShowToast,
      dictionary,
    });
  };

  handleOnSelectLink = async ({
    result,
    context,
  }: {
    result: SearchResult;
    from: number;
    to: number;
    context: string[];
  }) => {
    // maybe only run this when we're actually inserting shit?
    const [value, shouldClose] = await this.props.onQuerySectionResult(
      result,
      context
    );

    if (shouldClose === false) {
      if (this.props.onSearchSection) await this.props.onSearchSection("");
      return;
    }

    // send request here!
    const { view, onClose, parser } = this.props;

    onClose();
    this.props.view.focus();

    const { dispatch, state } = view;
    const { from, to } = state.selection;
    assert(from === to);

    // this is where the link inserting actually happens
    const paste = parser.parse(value.trim());
    const slice = paste.slice(0);

    const transaction = view.state.tr.replaceSelection(slice);
    view.dispatch(transaction);
  };

  render() {
    const { onCreateLink, onClose, ...rest } = this.props;
    const selection = this.props.view.state.selection;

    return (
      <FloatingToolbar
        ref={this.menuRef}
        active={isActive(this.props)}
        {...rest}
      >
        {isActive(this.props) && (
          <LinkSectionEditor
            from={selection.from}
            to={selection.to}
            onCreateLink={onCreateLink ? this.handleOnCreateLink : undefined}
            onSelectSection={this.handleOnSelectLink}
            onRemoveLink={onClose}
            {...rest}
          />
        )}
      </FloatingToolbar>
    );
  }
}
