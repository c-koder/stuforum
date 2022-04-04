import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import ReactQuill, { Delta } from "react-quill";
import "react-quill/dist/quill.snow.css";
import hljs from "highlight.js";
import "highlight.js/styles/stackoverflow-light.css";

import useWindowDimensions from "../hooks/useWindowDimensions";
import { PORT } from "../constants/Port";
import avatar from "../resources/img_avatar.png";

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
  const { width } = useWindowDimensions();
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);

  const submitComment = (e) => {
    e.preventDefault();
    const parent_id = props.parent_id;
    const replyTo = props.replyTo;
    const user_id = props.user_id;
    const nick_name = props.nick_name;
    const post_id = props.post_id;
    const replied_time = moment().format("YYYY-MM-DD HH:mm:ss").toString();
    if (description == "") {
      setError("Comment required.");
    } else {
      axios
        .post(`${PORT}reply/addreply`, {
          parent_id: parent_id,
          user_id: user_id,
          replied_to: replyTo,
          post_id: post_id,
          replied_time: replied_time,
          description: description,
        })
        .then(async (response) => {
          const data = {
            id: response.data.id,
            parent_id: parent_id,
            user_id: user_id,
            nick_name: nick_name,
            replied_to: response.data.replied_to,
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

          if (response.data.notif != null) {
            const notification = response.data.notif;
            await props.socket.emit("send_notification", notification);
          }
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
    !props.answered && (
      <div className="content-container" style={{}}>
        <div className="row mx-auto">
          {width > 992 && (
            <div className="col-1">
              <img
                href="#profile"
                className="avatar"
                src={avatar}
                alt="Profile"
              />
            </div>
          )}
          <div className="col" style={{ paddingTop: 15 }}>
            <ReactQuill
              onChange={handleChange}
              value={description}
              modules={modules}
              bounds={".quill reply"}
              formats={formats}
            />
            <div className="hstack pull-right my-3">
              {error != "" ? (
                <p class={`alert alert-${error == "" ? "success" : "danger"}`}>
                  {error}
                </p>
              ) : (
                <p />
              )}
              <button
                type="button"
                onClick={submitComment}
                className="btn btn-block"
                style={{ minWidth: 100, width: 100 }}
                disabled={disabled}
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CommentBox;
