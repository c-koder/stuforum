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
    <div
      style={{
        marginTop: reply != null ? "-15px" : "",
      }}
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
      <div
        style={{
          minWidth: reply != null && "120px",
          marginLeft: reply != null && "35.7%",
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
              <motion.button
                className="nullBtn"
                disabled={post.answered && true}
                onClick={() => {
                  onToggleUrgent(post.id);
                }}
                style={{ width: "100%", textAlign: "right" }}
                whileHover={{
                  x: -3,
                }}
              >
                <li style={{ color: post.answered && "#b4b4b4" }}>
                  {post.urgent ? "Unmark as Urgent" : "Mark as Urgent"}
                </li>
              </motion.button>
              <hr style={{ width: "75%", marginLeft: 22 }} />
              <motion.button
                disabled={post.urgent && true}
                className="nullBtn"
                onClick={() => {
                  onToggleAnswered(post.id);
                }}
                style={{ width: "100%", textAlign: "right" }}
                whileHover={{
                  x: -3,
                }}
              >
                <li style={{ color: post.urgent && "#b4b4b4" }}>
                  {post.answered ? "Unmark as Answered" : "Mark as Answered"}
                </li>
              </motion.button>
              <hr style={{ width: "75%", marginLeft: 22 }} />
            </div>
          )}
          <motion.button
            className="nullBtn"
            onClick={() => setConfirmationPopup(true)}
            style={{
              width: "100%",
              textAlign: reply != null ? "center" : "right",
            }}
            whileHover={{
              x: -3,
            }}
          >
            <li>Delete</li>
          </motion.button>
        </ul>
      </div>
    </div>
  );
};

export default ContextMenu;
