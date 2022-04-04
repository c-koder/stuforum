import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import hljs from "highlight.js";
import "highlight.js/styles/stackoverflow-light.css";
import { PORT } from "../constants/Port";
import useWindowDimensions from "../hooks/useWindowDimensions";

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

const mobile_modules = {
  syntax: {
    highlight: (description) => hljs.highlightAuto(description).value,
  },
  toolbar: [["bold", "italic", "underline"]],

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
  const [disabled, setDisabled] = useState(
    description === "" || description !== "<p><br></p>"
  );

  const submitComment = (e) => {
    e.preventDefault();
    const parent_id = props.parent_id;
    const replyTo = props.replyTo;
    const user_id = props.user_id;
    const nick_name = props.nick_name;
    const post_id = props.post_id;
    const replied_time = moment().format("YYYY-MM-DD HH:mm:ss").toString();
    if (description !== "" || description !== "<p><br></p>") {
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
    setDisabled(description === "" || description === "<p><br></p>");
  }, [description]);

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
      <div className="position-relative">
        <ReactQuill
          onChange={handleChange}
          value={description}
          placeholder="Leave an answer..."
          modules={width > 992 ? modules : mobile_modules}
          bounds={".quill .reply-to-editor"}
          formats={formats}
        />

        <button
          onClick={submitComment}
          className="btn position-absolute top-0 end-0"
          style={{
            padding: "3px 6px",
            marginRight: 8,
            fontSize: 14,
            marginTop: 10,
          }}
          disabled={disabled}
        >
          Reply
        </button>
      </div>
    )
  );
};

export default CommentBox;
