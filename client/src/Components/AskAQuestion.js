import { useContext, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import hljs from "highlight.js";
import "highlight.js/styles/stackoverflow-light.css";

import { PORT } from "../constants/Port";
import { AuthContext } from "../helpers/AuthContext";
import TagsInput from "./tags/TagsInput";

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

const AskAQuestion = () => {
  const { authState } = useContext(AuthContext);

  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const [error, setError] = useState("");

  const handleChange = (html) => {
    setDescription(html);
  };

  const submitQuestion = (e) => {
    e.preventDefault();
    if (question == "" && description == "") {
      setError("All fields are required.");
    } else if (question == "") {
      setError("Question is required");
    } else if (description == "") {
      setError("Description is required");
    } else {
      const posted_time = moment().format("YYYY-MM-DD HH:mm:ss").toString();

      axios
        .post(`${PORT}post/addpost`, {
          question: question,
          description: description,
          tags: selectedTags,
          user_id: authState.id,
          posted_time: posted_time,
          urgent: urgent,
        })
        .then((response) => {
          if (response.data.message == "post_added") {
            setQuestion("");
            setDescription("");
            setSelectedTags();
            window.location.reload();
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

  return (
    <div
      className="modal fade"
      id="askQuestionModal"
      data-bs-keyboard="false"
      data-bs-backdrop="static"
      tabIndex="-1"
      aria-labelledby="askQuestionModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div
          className="modal-content"
          style={{ borderRadius: 10, padding: "0px 10px" }}
        >
          <div className="modal-header">
            <h4>
              <strong>Ask a Question</strong>
            </h4>
            <button
              type="button"
              className="btn-close shadow-none"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <div
              className="content-container"
              style={{
                backgroundColor: "var(--primary-light)",
                marginBottom: 10,
              }}
            >
              <p style={{ color: "var(--primary)", lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600, color: "var(--primary)" }}>
                  Tips on getting good answers quickly
                </span>
                <br />
                &emsp;- Make sure your question has not been asked already
                <br />
                &emsp;- Keep your question short and to the point
                <br />
                &emsp;- Double check grammar and spelling
              </p>
            </div>
            <h6 style={{ fontWeight: 600 }}>
              {authState.nick_name} is asking...
            </h6>
            <div className="form-group my-3">
              <label htmlFor="name" className="form-label">
                Question
              </label>
              <input
                type="text"
                name="name"
                className="form-control shadow-none"
                placeholder="Ask your question"
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                }}
              />
            </div>
            <br />
            <ReactQuill
              onChange={handleChange}
              value={description || ""}
              modules={modules}
              bounds={".quill"}
              formats={formats}
            />

            <div className="form-group my-3">
              <label htmlFor="name" className="form-label">
                Tags
              </label>
              <TagsInput setSelectedTags={setSelectedTags} />
            </div>

            <div className="hstack my-3">
              <div className="form-group">
                <div className="form-check">
                  <input
                    className="form-check-input shadow-none"
                    type="checkbox"
                    id="urgentCheck"
                    checked={urgent}
                    value={urgent}
                    onChange={(e) => setUrgent(e.currentTarget.checked)}
                  />
                  <label className="form-check-label" htmlFor="urgentCheck">
                    Mark as urgent
                  </label>
                </div>
              </div>
              {error != "" ? (
                <p
                  className={`alert alert-${
                    error == "" ? "success" : "danger"
                  } ms-auto`}
                >
                  {error}
                </p>
              ) : (
                <p className="ms-auto" />
              )}
              <span className="">
                <button
                  className="btn btn-block shadow-none"
                  onClick={submitQuestion}
                >
                  Ask it
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskAQuestion;
