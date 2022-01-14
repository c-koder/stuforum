import home from "../resources/home.png";
import activeHome from "../resources/home-blue.png";
import questions from "../resources/questions.png";
import activeQuestions from "../resources/questions-blue.png";
import answers from "../resources/answers.png";
import activeAnswers from "../resources/answers-blue.png";
import tag from "../resources/tag.png";
import activeTag from "../resources/tag-blue.png";
import profile from "../resources/profile.png";
import activeProfile from "../resources/profile-blue.png";
import logout from "../resources/logout.png";
import { motion } from "framer-motion";

const MobileNav = ({ activeTab, onLogout, display }) => {
  return (
    <div
      className="rightbar"
      style={{
        overflow: "hidden",
        backgroundColor: "var(--bg)",
        margin: 0,
        marginTop: -10,
        marginBottom: 5,
      }}
    >
      <div style={{ display: display }}>
        <motion.a
          href="/home"
          className={
            activeTab === "home" ? "active rightbar-item" : "rightbar-item"
          }
          style={{
            margin: 0,
            padding: "13px 16px",
            textAlign: "left",
            color: "var(--secondary)",
          }}
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
          style={{
            margin: 0,
            padding: "13px 16px",
            textAlign: "left",
            color: "var(--secondary)",
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
          style={{
            margin: 0,
            padding: "13px 16px",
            textAlign: "left",
            color: "var(--secondary)",
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
          style={{
            margin: 0,
            padding: "13px 16px",
            textAlign: "left",
            color: "var(--secondary)",
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
        <motion.a
          href="/profile"
          className={
            activeTab === "profile" ? "active rightbar-item" : "rightbar-item"
          }
          whileHover={{
            scale: 1.03,
          }}
          style={{
            margin: 0,
            padding: "13px 16px",
            textAlign: "left",
            color: "var(--secondary)",
          }}
        >
          <span>
            <img
              className="navIcon"
              src={activeTab === "profile" ? activeProfile : profile}
            />
          </span>
          Profile
        </motion.a>
        <motion.a
          href=""
          className={"rightbar-item"}
          onClick={onLogout}
          whileHover={{
            scale: 1.03,
          }}
          style={{
            margin: 0,
            padding: "13px 16px",
            textAlign: "left",
            color: "var(--secondary)",
          }}
        >
          <span>
            <img className="navIcon" src={logout} />
          </span>
          Logout
        </motion.a>
      </div>
    </div>
  );
};

export default MobileNav;
