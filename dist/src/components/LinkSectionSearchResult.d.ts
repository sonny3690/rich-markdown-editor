import * as React from "react";
import { SearchResult } from "./LinkSectionEditor";
declare type Props = {
    onClick: (event: React.MouseEvent) => void;
    onMouseOver: (event: React.MouseEvent) => void;
    icon: React.ReactNode;
    selected: boolean;
    title: string;
    subtitle?: string;
    children?: SearchResult[];
};
declare function LinkSectionSearchResult({ title, subtitle, selected, icon, children, ...rest }: Props): JSX.Element;
export default LinkSectionSearchResult;
//# sourceMappingURL=LinkSectionSearchResult.d.ts.map