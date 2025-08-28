// import { Editor } from "./EditorArticle";
// import { Video1 } from "./Video1";
// import { Video1Continue } from "./Video1Continue";

import { Editor } from "./Editor/Editor.tsx";

// function App() {
//   return (
//     <div className="p-4 flex flex-col gap-4">
//       <h1 className="text-3xl font-bold underline">Hello World</h1>
//       <Editor />
//       <Video1 />
//       <Video1Continue />
//     </div>
//   );
// }

function App() {
  return (
    <div className="max-w-4xl mx-auto px-8 my-16">
      <h1 className="text-3xl font-serif">Lexical React Demo</h1>
      <Editor />
    </div>
  );
}

export default App;
