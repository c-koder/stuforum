import { abbreviateNumber } from "../helpers/AbbreviateNumber";

const TopUser = ({ topUser }) => {
  return (
    <div className="hstack">
      <a href={`/user/${topUser.nick_name}`}>
        <h5 style={{ color: "var(--primary)" }}>{topUser.nick_name}</h5>
      </a>
      <span style={{ marginLeft: "auto", marginRight: 0, display: "flex" }}>
        <h5 style={{ color: "var(--secondary)" }}>
          {abbreviateNumber(topUser.likes)}
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
  );
};

export default TopUser;
