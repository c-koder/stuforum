import { useState } from "react";
import ConfirmPopup from "./ConfirmPopup";

const ContextMenu = ({
  reply,
  post,
  onDelete,
  onToggleUrgent,
  onToggleAnswered,
}) => {
  const [confirmationPopup, setConfirmationPopup] = useState(false);

  return (
    <ul
      className="dropdown-menu dropdown-menu-end dropdown-context"
      aria-labelledby="post-context"
    >
      {confirmationPopup && (
        <ConfirmPopup
          confirmationPopup={confirmationPopup}
          setConfirmationPopup={setConfirmationPopup}
          onDelete={onDelete}
          post={post}
          reply={reply}
        />
      )}

      {post != null && (
        <div>
          <li
            className="dropdown-item"
            disabled={post.answered == 1 && true}
            onClick={() => {
              onToggleUrgent(post.id);
            }}
            style={{ color: post.answered == 1 && "var(--secondary)" }}
          >
            <i class="bi bi-check-all"></i>
            <span>
              {post.urgent == 1 ? "Unmark as Urgent" : "Mark as Urgent"}
            </span>
          </li>
          <li
            disabled={post.urgent == 1 && true}
            className="dropdown-item"
            onClick={() => {
              onToggleAnswered(post.id);
            }}
            style={{ color: post.urgent == 1 && "var(--secondary)" }}
          >
            <i class="bi bi-exclamation"></i>
            <span>
              {post.answered == 1 ? "Unmark as Answered" : "Mark as Answered"}
            </span>
          </li>
        </div>
      )}
      <li onClick={() => setConfirmationPopup(true)} className="dropdown-item">
        <i class="bi bi-x"></i>
        <span>Delete</span>
      </li>
    </ul>
  );
};

export default ContextMenu;
