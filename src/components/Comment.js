import { useState } from "react";

const Comment = ({ comment }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <button
        onClick={() => {
          setVisible(true);
        }}
      >
        show more
      </button>
      {visible && <div>{comment.text} - </div>}
    </div>
  );
};

export default Comment;
