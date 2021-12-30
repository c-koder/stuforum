import { useState } from "react";
import avatar from "../resources/img_avatar.png";

const CommentBox = ({ replyTo }) => {
  const [comment, setComment] = useState(
    replyTo != "" ? "@" + replyTo + " " : ""
  );
  const submitComment = () => {};

  return (
    <div className="postsContainer">
      <div
        className="postsContainer-div"
        style={{
          width: "10%",
          margin: "0 10px 0 0px",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <img href="#profile" className="avatar" src={avatar} alt="Profile" />
      </div>
      <div className="postsContainer-div">
        <span style={{ width: "100%" }}>
          <form className="questionForm" onSubmit={submitComment}>
            <div className="form-control" style={{ marginBottom: 30 }}>
              <textarea
                style={{
                  margin: "-20px 0px 0px 0px",
                  resize: "vertical",
                  height: 50,
                  minHeight: 50,
                  maxHeight: 200,
                }}
                className="txtArea"
                placeholder="Write an answer"
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
            </div>
            <input
              style={{
                float: "right",
                width: "20%",
                margin: "-5px 0px 0px 0px",
              }}
              className="btn btn-block"
              type="button"
              value="Reply"
            />
          </form>
        </span>
      </div>
    </div>
  );
};

export default CommentBox;
