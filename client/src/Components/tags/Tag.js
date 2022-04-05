import { Link } from "react-router-dom";

const Tag = ({ tag, tagOnly }) => {
  return (
    <div
      className="hstack"
      style={{
        display: "flex",
        float: tagOnly && "left",
        marginTop: tagOnly ? 10 : 5,
        marginRight: tagOnly && 5,
      }}
    >
      <Link
        to={`/tagged/${tag.name}`}
        className="tag"
        style={{ fontSize: tagOnly && 13 }}
      >
        {tag.name}
      </Link>
      {!tagOnly && (
        <h5
          style={{ color: "var(--secondary)", marginLeft: 5, fontWeight: 600 }}
        >
          {tag.frequency}
        </h5>
      )}
    </div>
  );
};

export default Tag;
