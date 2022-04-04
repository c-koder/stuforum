import { useEffect, useState } from "react";

import Tags from "./tags/Tags";
import useSortedTags from "../hooks//useSortedTags";

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
        <a
          href="/home"
          className={
            activeTab === "home" ? "active rightbar-item" : "rightbar-item"
          }
        >
          <i
            class="bi bi-house-door-fill"
            style={{
              fontSize: 20,
              color:
                activeTab === "home" ? "var(--primary)" : "var(--secondary)",
              marginRight: 10,
            }}
          ></i>
          Home
        </a>
        <a
          href="/myquestions"
          className={
            activeTab === "questions" ? "active rightbar-item" : "rightbar-item"
          }
        >
          <i
            class="bi bi-question-circle-fill"
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
        </a>
        <a
          href="/myanswers"
          className={
            activeTab === "answers" ? "active rightbar-item" : "rightbar-item"
          }
        >
          <i
            class="bi bi-chat-left-fill"
            style={{
              fontSize: 20,
              color:
                activeTab === "answers" ? "var(--primary)" : "var(--secondary)",
              marginRight: 10,
            }}
          ></i>
          My Answers
        </a>
        <a
          href="/tags"
          className={
            activeTab === "tags" ? "active rightbar-item" : "rightbar-item"
          }
        >
          <i
            class="bi bi-bookmark-fill"
            style={{
              fontSize: 22,
              color:
                activeTab === "tags" ? "var(--primary)" : "var(--secondary)",
              marginRight: 10,
            }}
          ></i>
          Tags
        </a>
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
