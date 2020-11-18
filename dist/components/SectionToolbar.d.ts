import * as React from "react";
import { EditorView } from "prosemirror-view";
import baseDictionary from "../dictionary";
import { SearchResult } from "./SectionEditor";
import { MarkdownParser } from "prosemirror-markdown";
declare type Props = {
    isActive: boolean;
    view: EditorView;
    tooltip: typeof React.Component | React.FC<any>;
    dictionary: typeof baseDictionary;
    parser: MarkdownParser<any>;
    onCreateLink?: (title: string) => Promise<string>;
    onSearchSection?: (term: string) => Promise<SearchResult[]>;
    onClickLink: (href: string, event: MouseEvent) => void;
    onShowToast?: (msg: string, code: string) => void;
    onQuerySectionResult: (result: SearchResult, context: string[]) => Promise<[string, boolean]>;
    onClose: () => void;
};
export default class LinkSectionToolbar extends React.Component<Props> {
    menuRef: React.RefObject<HTMLDivElement>;
    state: {
        left: number;
        top: undefined;
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleClickOutside: (ev: any) => void;
    handleOnCreateLink: (title: string) => Promise<void>;
    handleOnSelectLink: ({ result, context, }: {
        result: SearchResult;
        from: number;
        to: number;
        context: string[];
    }) => Promise<void>;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=SectionToolbar.d.ts.map