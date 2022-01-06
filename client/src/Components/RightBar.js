import { useEffect, useState } from "react";
import home from "../resources/home.png";
import activeHome from "../resources/home-blue.png";
import questions from "../resources/questions.png";
import activeQuestions from "../resources/questions-blue.png";
import answers from "../resources/answers.png";
import activeAnswers from "../resources/answers-blue.png";
import tag from "../resources/tag.png";
import activeTag from "../resources/tag-blue.png";
import Tags from "./tags/Tags";
import useSortedTags from "./dataHooks/useSortedTags";
import { motion } from "framer-motion";

const SideMenu = ({ activeTab }) => {
  const [tags, setTags] = useState([]);
  const { response } = useSortedTags();

  useEffect(() => {
    if (response !== null) {
      setTags(response);
    }
  }, [response]);

  return (
    <div>
      <div className="rightbar whiteContainer" style={{ marginTop: 0 }}>
        <motion.a
          href="/home"
          className={
            activeTab === "home" ? "active rightbar-item" : "rightbar-item"
          }
          whileHover={{
            scale: 1.03,
          }}
        >
          <span>
            <img
              className="navIcon"
              src={activeTab === "home" ? activeHome : home}
            />
          </span>
          Home
        </motion.a>
        <motion.a
          href="/myquestions"
          className={
            activeTab === "questions" ? "active rightbar-item" : "rightbar-item"
          }
          whileHover={{
            scale: 1.03,
          }}
        >
          <span>
            <img
              className="navIcon"
              src={activeTab === "questions" ? activeQuestions : questions}
            />
          </span>
          My Questions
        </motion.a>
        <motion.a
          href="/myanswers"
          className={
            activeTab === "answers" ? "active rightbar-item" : "rightbar-item"
          }
          whileHover={{
            scale: 1.03,
          }}
        >
          <span>
            <img
              className="navIcon"
              src={activeTab === "answers" ? activeAnswers : answers}
            />
          </span>
          My Answers
        </motion.a>
        <motion.a
          href="/tags"
          className={
            activeTab === "tags" ? "active rightbar-item" : "rightbar-item"
          }
          whileHover={{
            scale: 1.03,
          }}
        >
          <span>
            <img
              className="navIcon"
              src={activeTab === "tags" ? activeTag : tag}
            />
          </span>
          Tags
        </motion.a>
      </div>
      <div className="whiteContainer">
        <h2 style={{ marginBottom: 20 }}>Frequently used tags</h2>
        <Tags tags={tags} tagsOnly={false} />
      </div>
    </div>
  );
};

export default SideMenu;
