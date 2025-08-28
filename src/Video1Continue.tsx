import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

const theme = {};

function onError(error: Error) {
  console.error(error);
}

export function Video1Continue() {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
  };
  return (
    <div className="relative">
      <LexicalComposer initialConfig={initialConfig}>
        <PlainTextPlugin
          contentEditable={
            <ContentEditable className="h-[300px] w-[300px] p-2 border-2 border-red-500 " />
          }
          placeholder={
            <div className="absolute top-2 left-2 placeholder:text-sm placeholder:text-gray-500">
              Start writing...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </LexicalComposer>
    </div>
  );
}
