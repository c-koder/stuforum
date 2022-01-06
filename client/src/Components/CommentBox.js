import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import avatar from "../resources/img_avatar.png";
import ReactQuill, { Delta } from "react-quill";
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
  const [disabled, setDisabled] = useState(false);

  const submitComment = (e) => {
    e.preventDefault();
    const parent_id = props.parent_id;
    const replyTo = props.replyTo;
    const user_id = props.user_id;
    const post_id = props.post_id;
    const replied_time = moment().format("YYYY-MM-DD HH:mm:ss").toString();
    if (description == "") {
      setError("Please add a comment");
    } else {
      axios
        .post("http://localhost:3001/addreply", {
          parent_id: parent_id,
          user_id: user_id,
          replied_to: replyTo,
          post_id: post_id,
          replied_time: replied_time,
          description: description,
        })
        .then((response) => {
          const data = {
            id: response.data.id,
            parent_id: parent_id == null ? response.data.id : parent_id,
            user_id: user_id,
            user_name: response.data.user_name,
            replied_to:
              response.data.replied_to != null
                ? response.data.replied_to
                : null,
            post_id: post_id,
            replied_time: replied_time,
            description: description,
            replies: null,
            likes: 0,
            dislikes: 0,
          };
          setDisabled(true);
          setDescription("");
          props.addReply(data);
        });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setError("");
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  window.onbeforeunload = () => {
    if (description != "") {
      return "There are unsaved changes. Are you sure you want to proceed?";
    }
  };

  const handleChange = (html) => {
    setDescription(html);
  };

  return (
    <>
      {!props.answered && (
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
            <img
              href="#profile"
              className="avatar"
              src={avatar}
              alt="Profile"
            />
          </div>
          <div className="postsContainer-div">
            <span style={{ width: "100%" }}>
              <div className="form-control" style={{ marginBottom: 30 }}>
                <ReactQuill
                  onChange={handleChange}
                  value={description}
                  modules={modules}
                  bounds={".quill reply"}
                  formats={formats}
                />
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
                disabled={disabled}
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
      )}
    </>
  );
};

export default CommentBox;
