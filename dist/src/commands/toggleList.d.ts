import { NodeType } from "prosemirror-model";
import { EditorState, Transaction } from "prosemirror-state";
export default function toggleList(listType: NodeType, itemType: NodeType): (state: EditorState<any>, dispatch: (tr: Transaction<any>) => void) => boolean;
//# sourceMappingURL=toggleList.d.ts.map