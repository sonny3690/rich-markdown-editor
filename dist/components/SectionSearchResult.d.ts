import * as React from "react";
declare type Props = {
    onClick: (event: React.MouseEvent) => void;
    onMouseOver: (event: React.MouseEvent) => void;
    icon: React.ReactNode;
    selected: boolean;
    title: string;
    subtitle?: string;
};
declare function SectionSearchResult({ title, subtitle, selected, icon, ...rest }: Props): JSX.Element;
export default SectionSearchResult;
//# sourceMappingURL=SectionSearchResult.d.ts.map