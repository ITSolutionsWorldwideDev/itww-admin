"use client";

import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";

// import { EditorContent, useEditor } from "@tiptap/react";
// import { BubbleMenu } from "@tiptap/extension-bubble-menu";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import MediaPickerModal from "@/components/Media/MediaPickerModal";

import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Document from '@tiptap/extension-document';
import { Dropcursor } from '@tiptap/extensions';

import Placeholder from "@tiptap/extension-placeholder";
// optional community plugin for resizing
import ResizeImage from "tiptap-extension-resize-image";

/* export default function TipTapEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (content: string) => void;
}) {
  const [showMediaModal, setShowMediaModal] = useState(false);

  // const editor = useEditor({
  //   extensions: [
  //     StarterKit,
  //     Placeholder.configure({ placeholder: "Write your blog..." }),
  //     TextAlign.configure({
  //       types: ["heading", "paragraph", "image"],
  //     }),
  //     Image.configure({
  //       inline: false,
  //       allowBase64: true,
  //     }),
  //     ResizeImage, // enable image resizing (optional)
  //   ],
  //   content: value || "",
  //   immediatelyRender: false,
  //   onUpdate: ({ editor }) => {
  //     onChange(editor.getHTML());
  //   },
  // });

  const editor = useEditor({
    extensions: [
      Document, 
      Paragraph,
      Text,
      StarterKit,
      Dropcursor,
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
      
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      ResizeImage, // enable image resizing (optional)
      Placeholder.configure({
        placeholder: "Write your blog content...",
      }),
      BubbleMenuExtension.configure({
        element: document.createElement("div"), // required placeholder element
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageInsert = (url: string) => {
    if (!editor) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="rounded-lg border p-3">

      <div className="mb-2 flex flex-wrap gap-2 border-b pb-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded px-2 py-1 ${
            editor.isActive("bold") ? "bg-primary text-white" : "bg-gray-200"
          }`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded px-2 py-1 ${
            editor.isActive("italic") ? "bg-primary text-white" : "bg-gray-200"
          }`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded px-2 py-1 ${
            editor.isActive("strike") ? "bg-primary text-white" : "bg-gray-200"
          }`}
        >
          S
        </button>

        
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className="rounded bg-gray-200 px-2 py-1"
        >
          ⬅️
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className="rounded bg-gray-200 px-2 py-1"
        >
          ⬆️
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className="rounded bg-gray-200 px-2 py-1"
        >
          ➡️
        </button>


        <button
          type="button"
          onClick={() => setShowMediaModal(true)}
          className="rounded bg-gray-200 px-2 py-1"
        >
          🖼️ Add Image
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="prose min-h-[200px] max-w-none"
      />


      {showMediaModal && (
        <MediaPickerModal
          open={showMediaModal}
          onClose={() => setShowMediaModal(false)}
          onSelect={(items) => {
            if (items.length > 0) {
              handleImageInsert(items[0].file_path);
              setShowMediaModal(false);
            }
          }}
        />
      )}
    </div>
  );
}
 */
interface TipTapEditorProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (name: string, value: string) => void;
}

export default function TipTapEditor({
  label,
  name,
  value,
  placeholder,
  required,
  disabled,
  onChange,
}: TipTapEditorProps) {
  const [isClient, setIsClient] = useState(false);
  const [openMedia, setOpenMedia] = useState(false);

  useEffect(() => setIsClient(true), []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({ HTMLAttributes: { class: "max-w-full rounded-md" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "<p></p>",
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(name, editor.getHTML()),
  });

  // Keep editor content in sync
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>");
    }
  }, [value, editor]);

  // ✅ Insert image into editor
  const handleImageInsert = (selected: any[]) => {
    if (!selected || selected.length === 0) return;
    const file = selected[0]; // pick first if multiple not used
    const imageUrl = file.file_path;
    editor?.chain().focus().setImage({ src: imageUrl }).run();
    setOpenMedia(false);
  };

  if (!isClient)
    return (
      <div className="border border-stroke dark:border-dark-3 rounded-lg min-h-[200px] p-3 bg-gray-50 dark:bg-dark-2 animate-pulse" />
    );

  if (!editor) return <p>Loading editor...</p>;

  return (
    <div className="space-y-3">
      <label className="block text-body-sm font-medium text-dark dark:text-white">
        {label} {required && "*"}
      </label>

     
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2 mb-2">

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("bold") ? "bg-primary text-white" : "bg-gray-200"
          }`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("italic") ? "bg-primary text-white" : "bg-gray-200"
          }`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("underline") ? "bg-primary text-white" : "bg-gray-200"
          }`}
        >
          U
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("strike") ? "bg-primary text-white" : "bg-gray-200"
          }`}
        >
          S
        </button>


        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          Left
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          Center
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          Right
        </button>


        <button
          type="button"
          onClick={() => setOpenMedia(true)}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          🖼️ Image
        </button>
      </div>


      <div
        className={`border border-stroke dark:border-dark-3 rounded-lg min-h-[200px] p-3 ${
          disabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <EditorContent
          editor={editor}
          className="focus:outline-none prose dark:prose-invert max-w-none"
        />
      </div>


      {openMedia && (
        <MediaPickerModal
          open={openMedia} // ✅ correct prop name
          onClose={() => setOpenMedia(false)}
          multiple={false}
          module_ref="blogs"
          onSelect={handleImageInsert} // ✅ gets MediaItem[]
        />
      )}
    </div>
  );
}
