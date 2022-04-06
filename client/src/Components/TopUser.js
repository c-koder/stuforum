import { Link } from "react-router-dom";
import { abbreviateNumber } from "../helpers/AbbreviateNumber";
import { AuthContext } from "../helpers/AuthContext";
import { useContext } from "react";

const TopUser = ({ topUser }) => {
  const { authState } = useContext(AuthContext);

  return (
    <div className="hstack">
      <Link
        to={
          authState.nick_name == topUser.nick_name
            ? "/profile"
            : `/user/${topUser.nick_name}`
        }
      >
        <h5 style={{ color: "var(--primary)" }}>{topUser.nick_name}</h5>
      </Link>
      <span style={{ marginLeft: "auto", marginRight: 0, display: "flex" }}>
        <h5 style={{ color: "var(--secondary)" }}>
          {abbreviateNumber(topUser.likes)}
        </h5>
        <i
          className="bi bi-hand-thumbs-up-fill"
          style={{
            marginLeft: 5,
            color: "var(--primary)",
            fontSize: 22,
          }}
        ></i>
      </span>
    </div>
  );
};

export default TopUser;
