"use client";

import {
  MDXEditor,
  MDXEditorMethods,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
} from "@mdxeditor/editor";
import { FC, useEffect, useRef } from "react";

interface EditorProps {
  markdown: string;
  onChange: (content: string) => void;
  onBlur: () => void;
  id: number;
}

const MarkdownEditor: FC<EditorProps> = ({
  markdown,
  onChange,
  onBlur,
  id,
}) => {
  const editorRef = useRef<MDXEditorMethods | null>(null);

  const handleContentChange = (newMarkdown: string) => {
    onChange(newMarkdown);
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setMarkdown(markdown);
    }
  }, [markdown]);

  return (
    <MDXEditor
      key={id}
      ref={editorRef}
      markdown={markdown}
      onChange={handleContentChange}
      className=""
      onBlur={onBlur}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
      ]}
    />
  );
};

export default MarkdownEditor;
