import { useRef } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MiB

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

          if (file) {
            if (file.size > MAX_FILE_SIZE) {
              alert("Image must be 5 MB or smaller.");
            } else {
              onUpload?.(file);
            }
          }

          e.target.value = "";
        }}
      />
    </>
  );
};
export default ImageUpload;
