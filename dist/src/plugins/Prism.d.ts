import { Plugin } from "prosemirror-state";
export declare const LANGUAGES: {
    none: string;
    bash: string;
    css: string;
    clike: string;
    csharp: string;
    markup: string;
    java: string;
    javascript: string;
    json: string;
    php: string;
    powershell: string;
    python: string;
    ruby: string;
    typescript: string;
};
export default function Prism({ name, deferred }: {
    name: any;
    deferred?: boolean | undefined;
}): Plugin<any, any>;
//# sourceMappingURL=Prism.d.ts.map