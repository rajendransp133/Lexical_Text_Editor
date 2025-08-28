import { createContext, type ReactNode, useContext, useMemo } from "react";

import {
  createEmptyHistoryState,
  type HistoryState,
} from "@lexical/react/LexicalHistoryPlugin";

type EditorHistoryStateContext = {
  historyState?: HistoryState;
};

const Context = createContext<EditorHistoryStateContext>({});

export function EditorHistoryStateContext({
  children,
}: {
  children: ReactNode;
}) {
  const h = useMemo(() => ({ historyState: createEmptyHistoryState() }), []);
  return <Context.Provider value={h}>{children}</Context.Provider>;
}

export function useEditorHistoryState(): EditorHistoryStateContext {
  return useContext(Context);
}
