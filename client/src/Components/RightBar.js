import { useEffect, useState } from "react";

import Tags from "./tags/Tags";
import useSortedTags from "../hooks//useSortedTags";
import { Link } from "react-router-dom";

const RightBar = ({ activeTab }) => {
  const [tags, setTags] = useState([]);
  const { response } = useSortedTags();

  useEffect(() => {
    if (response !== null) {
      setTags(response);
    }
  }, [response]);

  return (
    <div className="sticky-top">
      <div className="rightbar content-container">
        <Link
          to="/home"
          className={
            activeTab === "home" ? "active rightbar-item" : "rightbar-item"
          }
        >
          <i
            className="bi bi-house-door-fill"
            style={{
              fontSize: 20,
              color:
                activeTab === "home" ? "var(--primary)" : "var(--secondary)",
              marginRight: 10,
            }}
          ></i>
          Home
        </Link>
        <Link
          to="/myquestions"
          className={
            activeTab === "questions" ? "active rightbar-item" : "rightbar-item"
          }
        >
          <i
            className="bi bi-question-circle-fill"
            style={{
              fontSize: 20,
              color:
                activeTab === "questions"
                  ? "var(--primary)"
                  : "var(--secondary)",
              marginRight: 10,
            }}
          ></i>
          My Questions
        </Link>
        <Link
          to="/myanswers"
          className={
            activeTab === "answers" ? "active rightbar-item" : "rightbar-item"
          }
        >
          <i
            className="bi bi-chat-left-fill"
            style={{
              fontSize: 20,
              color:
                activeTab === "answers" ? "var(--primary)" : "var(--secondary)",
              marginRight: 10,
            }}
          ></i>
          My Answers
        </Link>
        <Link
          to="/tags"
          className={
            activeTab === "tags" ? "active rightbar-item" : "rightbar-item"
          }
        >
          <i
            className="bi bi-bookmark-fill"
            style={{
              fontSize: 22,
              color:
                activeTab === "tags" ? "var(--primary)" : "var(--secondary)",
              marginRight: 10,
            }}
          ></i>
          Tags
        </Link>
      </div>
      <div
        className="content-container"
        style={{ marginTop: 25, paddingBottom: 0 }}
      >
        <h5 style={{ marginBottom: 20, fontWeight: 600 }}>
          Frequently used tags
        </h5>
        <Tags tags={tags} tagsOnly={false} />
      </div>
    </div>
  );
};

export default RightBar;
