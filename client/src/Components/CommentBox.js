import moment from "moment";
import { useState } from "react";
import avatar from "../resources/img_avatar.png";

const CommentBox = (props) => {
  const [description, setDescription] = useState();
  const [error, setError] = useState("");

  const submitComment = () => {
    const replied_time = moment().format("YYYY-MM-DD HH:mm:ss").toString();

    if (description == "") {
    }
  };

  const errorStyling = () => {
    if (error != "") {
      return "error active";
    } else {
      return "error";
    }
  };

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
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
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
        <div
          id="error"
          className={errorStyling()}
          style={{
            marginLeft: 5,
          }}
        >
          {error}
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
