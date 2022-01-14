import { useContext, useEffect, useState } from "react";
import AskAQuestion from "./AskAQuestion";
import Button from "./Button";
import TopUsers from "./TopUsers";
import like from "../resources/like-blue.png";
import { motion } from "framer-motion";
import useSortedUsers from "./dataHooks/useSortedUsers";
import { Link } from "react-router-dom";
import { abbreviateNumber } from "../helpers/AbbreviateNumber";
import axios from "axios";
import useUser from "../Components/dataHooks/useUser";
import { AuthContext } from "../helpers/AuthContext";

const LeftBar = ({ userQuestionCount }) => {
  const { authState } = useContext(AuthContext);

  const [questionPopup, setQuestionPopup] = useState(false);
  
  const [user, setUser] = useState([]);
  const { userResponse } = useUser(authState.nick_name);

  useEffect(() => {
    if (userResponse !== null) {
      setUser(userResponse);
    }
  }, [userResponse]);

  const [topUsers, setTopUsers] = useState([]);
  const { sortedUserResponse } = useSortedUsers();

  useEffect(() => {
    if (sortedUserResponse !== null) {
      setTopUsers(sortedUserResponse);
    }
  }, [sortedUserResponse]);

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
          <Link to="/profile">
            <h3 style={{ color: "var(--primary)", fontSize: 22 }}>
              You{" "}
              <span style={{ color: "var(--secondary)" }}>
                ({abbreviateNumber(userQuestionCount)})
              </span>
            </h3>
          </Link>
          <span style={{ marginLeft: "auto", marginRight: 0, display: "flex" }}>
            <h3 style={{ color: "var(--secondary)", fontSize: 22 }}>
              {abbreviateNumber(user != null && user.likes)}
            </h3>
            <img
              style={{ marginLeft: 10, height: 25, marginTop: 3 }}
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
