import { useRef } from "react";
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
  height = "200px"
}: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  // Custom toolbar options
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image'
  ];

  // Handle value changes
  const handleChange = (content: string, delta: any, source: any, editor: any) => {
    // Get plain text content to check if editor is actually empty
    const text = editor.getText().trim();
    
    // If the editor only contains empty HTML tags, treat as empty
    if (text === '' || content === '<p><br></p>') {
      onChange('');
    } else {
      onChange(content);
    }
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          backgroundColor: 'white',
          minHeight: height
        }}
      />
    </div>
  );
}