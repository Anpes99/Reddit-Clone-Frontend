import { useRef } from "react";

const ImageUpload = ({ onUpload, text, className }) => {
  const inputRef = useRef(null);

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={className}
      >
        {text}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload?.(file);
          e.target.value = "";
        }}
      />
    </>
  );
};
export default ImageUpload;
