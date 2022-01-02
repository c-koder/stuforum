import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import avatar from "../resources/img_avatar.png";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import hljs from "highlight.js";
import "highlight.js/styles/stackoverflow-light.css";

hljs.configure({
  languages: ["javascript", "java", "c", "c++", "python"],
});

const modules = {
  syntax: {
    highlight: (description) => hljs.highlightAuto(description).value,
  },
  toolbar: [
    ["bold", "italic", "underline"],
    ["code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
  ],

  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "code-block",
  "list",
  "bullet",
  "link",
  "image",
];

const CommentBox = (props) => {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const submitComment = (e) => {
    e.preventDefault();
    const id = Math.floor(Math.random() * 10000) + 1;
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
            id: response.data.id != null ? response.data.id : id,
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
            <ReactQuill
              onChange={handleChange}
              value={description}
              modules={modules}
              bounds={".quill"}
              formats={formats}
            />
            {/* {props.replyTo == "" ? (
              <ReactQuill
                onChange={handleChange}
                value={description}
                modules={modules}
                bounds={".quill"}
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
                placeholder="Leave a reply..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            )} */}
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
