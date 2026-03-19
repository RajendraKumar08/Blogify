import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import ImageTool from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";


const BlogEditor = ({ setContent, initialContent }) => {

  const editorRef = useRef(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const initEditor = async () => {
      // Destroy existing editor if it exists
      if (editorRef.current) {
        try {
          await editorRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying editor:', error);
        }
        editorRef.current = null;
      }

      // Clear the holder
      const holder = document.getElementById('editorjs');
      if (holder) {
        holder.innerHTML = '';
      }

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
        data: initialContent || {},
        onChange: async (api) => {
          try {
            const data = await api.saver.save();
            setContent(data);
          } catch (error) {
            console.error('Error saving editor data:', error);
          }
        }
      });

      // Wait for editor to be ready
      await editor.isReady;

      editorRef.current = editor;
      isInitializedRef.current = true;
    };

    initEditor();

    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying editor in cleanup:', error);
        }
      }
    };
  }, [initialContent]);

  return <div id="editorjs" className="border p-4"></div>;
};;

export default BlogEditor;