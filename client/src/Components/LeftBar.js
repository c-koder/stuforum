import { useContext, useEffect, useState } from "react";
import AskAQuestion from "./AskAQuestion";
import Button from "./Button";
import TopUsers from "./TopUsers";
import like from "../resources/like-blue.png";
import { motion } from "framer-motion";
import useSortedUsers from "./dataHooks/useSortedUsers";
import { AuthContext } from "../helpers/AuthContext";
import useUserPosts from "./dataHooks/useUserPosts";

const LeftBar = ({ addPost }) => {
  const { authState } = useContext(AuthContext);
  const [questionPopup, setQuestionPopup] = useState(false);

  const [topUsers, setTopUsers] = useState([]);
  const { response } = useSortedUsers();

  useEffect(() => {
    if (response !== null) {
      setTopUsers(response);
    }
  }, [response]);

  const [userQuestionCount, setUserQuestionCount] = useState();
  const { userQuestionsResponse } = useUserPosts(authState.id);

  useEffect(() => {
    if (userQuestionsResponse !== null) {
      setUserQuestionCount(userQuestionsResponse.length);
    }
  }, [userQuestionsResponse]);

  const askQuestion = (e) => {
    e.preventDefault();
    setQuestionPopup(true);
  };
  return (
    <div>
      {questionPopup && (
        <AskAQuestion
          questionPopup={questionPopup}
          setQuestionPopup={setQuestionPopup}
          addPost={addPost}
        />
      )}
      <Button onClick={askQuestion} text={"Ask a Question"} />
      <div className="whiteContainer">
        <h2 style={{ marginBottom: 20 }}>Top Users</h2>
        <TopUsers topUsers={topUsers} />
        <hr />

        <motion.span
          style={{ display: "flex", marginBottom: 20, marginTop: 20 }}
          whileHover={{
            x: -1,
          }}
        >
          <a href="/profile">
            <h3 style={{ color: "var(--primary)", fontSize: 22 }}>
              You{" "}
              <span style={{ color: "var(--secondary)" }}>
                ({userQuestionCount})
              </span>
            </h3>
          </a>
          <span style={{ marginLeft: "auto", marginRight: 0, display: "flex" }}>
            <h3 style={{ color: "var(--secondary)", fontSize: 22 }}>
              {authState.likes}
            </h3>
            <img
              style={{ marginLeft: 10, height: 25 }}
              className="icon"
              src={like}
            />
          </span>
        </motion.span>
      </div>
    </div>
  );
};

export default LeftBar;
