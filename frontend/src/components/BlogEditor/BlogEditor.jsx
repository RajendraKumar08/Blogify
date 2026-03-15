import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import ImageTool from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";


const BlogEditor = ({ setContent }) => {

  const editorRef = useRef(null);

  useEffect(() => {

    const editor = new EditorJS({
      holder: "editorjs",
      tools: {
        header: Header,
        paragraph: Paragraph,
        list: List,
        code: Code,
        image: ImageTool,
        quote: Quote
      },
      async onChange(api) {
        const data = await api.saver.save();
        setContent(data);
      }
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
    };

  }, []);

  return <div id="editorjs" className="border p-4"></div>;
};

export default BlogEditor;