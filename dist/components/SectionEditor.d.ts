import * as React from "react";
import { EditorView } from "prosemirror-view";
import { Mark } from "prosemirror-model";
import theme from "../theme";
import baseDictionary from "../dictionary";
export declare type SearchResult = SearchResultDrawer | SearchResultItem;
declare type SearchResultItem = {
    name: string;
    subtitle?: string;
    id: string;
    children: undefined;
};
declare type SearchResultDrawer = SearchResultItem & {
    children: SearchResult[];
};
declare type Props = {
    mark?: Mark;
    from: number;
    to: number;
    tooltip: typeof React.Component | React.FC<any>;
    dictionary: typeof baseDictionary;
    onRemoveLink?: () => void;
    onCreateLink?: (title: string) => Promise<void>;
    onSearchSection?: (term: string) => Promise<SearchResult[]>;
    onSelectSection: ({ result, from, to, context, }: {
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
declare type State = {
    results: {
        [keyword: string]: SearchResult[];
    };
    value: string;
    previousValue: string;
    selectedIndex: number;
};
declare class LinkSectionEditor extends React.Component<Props, State> {
    discardInputValue: boolean;
    initialValue: string;
    initialSelectionLength: number;
    state: State;
    searchContext: string[];
    get href(): string;
    get suggestedLinkTitle(): string;
    componentDidMount: () => Promise<void>;
    componentWillUnmount: () => void;
    save: (result: SearchResult) => void;
    handleKeyDown: (event: React.KeyboardEvent<Element>) => void;
    handleFocusLink: (selectedIndex: number) => void;
    updateSearchResults: (results: SearchResult[], previousValue: string) => void;
    handleChange: (event: any) => Promise<void>;
    handleOpenLink: (event: any) => void;
    handleCreateLink: (value: string) => Promise<void> | undefined;
    handleRemoveLink: () => void;
    processNewItems: () => void;
    handleSelectSection: (selectedResult: SearchResult) => (event: any) => Promise<void>;
    moveSelectionToEnd: () => void;
    render(): JSX.Element;
}
declare const _default: React.ForwardRefExoticComponent<Pick<Props & React.RefAttributes<LinkSectionEditor>, "mark" | "view" | "tooltip" | "ref" | "from" | "to" | "key" | "dictionary" | "onRemoveLink" | "onCreateLink" | "onSearchSection" | "onSelectSection" | "onClickLink" | "onShowToast"> & {
    theme?: any;
}>;
export default _default;
//# sourceMappingURL=SectionEditor.d.ts.map