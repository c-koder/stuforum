import { motion } from "framer-motion";
import { useState } from "react";
import ConfirmPopup from "./ConfirmPopup";

const ContextMenu = ({
  reply,
  post,
  show,
  onDelete,
  onToggleUrgent,
  onToggleAnswered,
}) => {
  const [confirmationPopup, setConfirmationPopup] = useState(false);

  return (
    <div>
      {confirmationPopup && (
        <ConfirmPopup
          confirmationPopup={confirmationPopup}
          setConfirmationPopup={setConfirmationPopup}
          onDelete={onDelete}
          post={post}
          reply={reply}
        />
      )}
      <div
        style={{
          minWidth: reply != null && "80px",
          width: post != null && "200px",
          marginLeft: reply != null ? "-55px" : "-155px",
        }}
        className={"context-content" + (show ? " shown" : "")}
      >
        <ul
          style={{
            listStyleType: "none",
          }}
        >
          {post != null && (
            <div>
              <motion.li
                disabled={post.answered == 1 && true}
                onClick={() => {
                  onToggleUrgent(post.id);
                }}
                whileHover={{
                  x: -3,
                }}
                style={{ color: post.answered == 1 && "var(--secondary)" }}
              >
                {post.urgent == 1 ? "Unmark as Urgent" : "Mark as Urgent"}
              </motion.li>
              <hr style={{ width: "90%", margin: "0 auto" }} />
              <motion.li
                disabled={post.urgent == 1 && true}
                className="nullBtn"
                onClick={() => {
                  onToggleAnswered(post.id);
                }}
                style={{ color: post.urgent == 1 && "var(--secondary)" }}
              >
                {post.answered == 1 ? "Unmark as Answered" : "Mark as Answered"}
              </motion.li>
              <hr style={{ width: "90%", margin: "0 auto" }} />
            </div>
          )}
          <motion.li
            onClick={() => setConfirmationPopup(true)}
            style={{
              width: "100%",
              textAlign: reply != null ? "center" : "right",
            }}
            whileHover={{
              x: -3,
            }}
          >
            Delete
          </motion.li>
        </ul>
      </div>
    </div>
  );
};

export default ContextMenu;
