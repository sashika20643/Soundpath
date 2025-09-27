import { useRef, useEffect, useId } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter detailed description...",
  className = "",
  height = "200px",
}: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);
  const editorId = useId();

  // Apply height styles to the editor after it mounts
  useEffect(() => {
    const applyHeight = () => {
      if (quillRef.current) {
        const editorElement = quillRef.current
          .getEditor()
          .root.querySelector(".ql-editor") as HTMLElement;
        const containerElement = quillRef.current
          .getEditor()
          .root.querySelector(".ql-container") as HTMLElement;

        if (editorElement) {
          editorElement.style.height = height;
          editorElement.style.minHeight = height;
          editorElement.style.maxHeight = "none";
        }
        if (containerElement) {
          containerElement.style.height = height;
          containerElement.style.minHeight = height;
        }
      }
    };

    // Apply immediately
    applyHeight();

    // Also apply after a short delay to ensure Quill is fully initialized
    const timeoutId = setTimeout(applyHeight, 100);

    return () => clearTimeout(timeoutId);
  }, [height, value]);

  // Custom toolbar options
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  // Handle value changes
  const handleChange = (
    content: string,
    delta: any,
    source: any,
    editor: any,
  ) => {
    // Get plain text content to check if editor is actually empty
    const text = editor.getText().trim();

    // If the editor only contains empty HTML tags, treat as empty
    if (text === "" || content === "<p><br></p>") {
      onChange("");
    } else {
      onChange(content);
    }
  };

  return (
    <div className={`rich-text-editor ${className}`} id={editorId}>
      <style>{`
        #${editorId} .ql-container {
          height: ${height} !important;
          min-height: ${height} !important;
        }
        #${editorId} .ql-editor {
          height: ${height} !important;
          min-height: ${height} !important;
          max-height: none !important;
        }
        .ql-container.ql-snow{
        border: none !important;
        }
      `}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          borderRadius: "6px",
          backgroundColor: "#fcfbf8",
          height: height,
          minHeight: height,
        }}
      />
    </div>
  );
}
