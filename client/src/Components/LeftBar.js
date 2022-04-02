import { useContext, useEffect, useState } from "react";
import AskAQuestion from "./AskAQuestion";
import Button from "./Button";
import TopUsers from "./TopUsers";
import useSortedUsers from "../hooks/useSortedUsers";
import { Link } from "react-router-dom";
import { abbreviateNumber } from "../helpers/AbbreviateNumber";
import useUser from "../hooks/useUser";
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
      <div className="content-container" style={{ marginTop: 25 }}>
        <h5 style={{ marginBottom: 20, fontWeight: 600 }}>Top Users</h5>
        <TopUsers topUsers={topUsers} />
        <hr />
        <div className="hstack">
          <Link to="/profile">
            <h5 style={{ color: "var(--primary)", fontWeight: 600 }}>
              You{" "}
              <span style={{ color: "var(--secondary)" }}>
                ({abbreviateNumber(userQuestionCount)})
              </span>
            </h5>
          </Link>
          <span style={{ marginLeft: "auto", display: "flex" }}>
            <h5 style={{ color: "var(--secondary)", fontWeight: 600 }}>
              {abbreviateNumber(user != null && user.likes)}
            </h5>
            <i
              class="bi bi-hand-thumbs-up-fill"
              style={{
                marginLeft: 5,
                color: "var(--primary)",
                fontSize: 22,
              }}
            ></i>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
