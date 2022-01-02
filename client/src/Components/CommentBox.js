import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import avatar from "../resources/img_avatar.png";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CommentBox = (props) => {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const submitComment = () => {
    const parent_id = props.parent_id;
    const replyTo = props.replyTo;
    const user_id = props.user_id;
    const user_name = props.user_name;
    const post_id = props.post_id;
    const replied_time = moment().format("YYYY-MM-DD HH:mm:ss").toString();
    if (description == "") {
      setError("Please add a comment");
    } else {
      axios
        .post("http://localhost:3001/addreply", {
          parent_id: parent_id,
          user_id: user_id,
          user_name: user_name,
          replied_to: replyTo,
          post_id: post_id,
          replied_time: replied_time,
          description: description,
        })
        .then((response) => {
          const data = {
            id: response.data.id != null ? response.data.id : null,
            parent_id: parent_id == null ? response.data.id : parent_id,
            user_id: user_id,
            user_name: user_name,
            replied_to: replyTo == "" ? null : replyTo,
            post_id: post_id,
            replied_time: replied_time,
            description: description,
            replies: null,
            likes: 0,
            dislikes: 0,
          };

          setDescription("");
          props.addReply(data);
        });
    }
  };

  let modules = {
    toolbar: [
      [{ size: [] }],
      ["bold", "italic", "underline"],
      ["code"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  let formats = [
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];

  const handleChange = (html) => {
    setDescription(html);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setError("");
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="postsContainer" style={{ marginBottom: 20 }}>
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
          <div className="form-control" style={{ marginBottom: 30 }}>
            {props.replyTo == "" ? (
              <ReactQuill
                onChange={handleChange}
                value={description}
                modules={modules}
                bounds={".quillcontent"}
                formats={formats}
              />
            ) : (
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
            )}
          </div>
          <button
            type="button"
            style={{
              marginLeft: 5,
              float: "right",
              width: "20%",
              margin: "-5px 0px 0px 0px",
            }}
            onClick={submitComment}
            className="btn btn-block"
          >
            Reply
          </button>
          <div
            id="error"
            className={error !== "" ? "error active" : "error"}
            style={{
              float: "right",
              margin: 0,
              marginRight: 20,
              marginTop: -5,
            }}
          >
            {error}
          </div>
        </span>
      </div>
    </div>
  );
};

export default CommentBox;
