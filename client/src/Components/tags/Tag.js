const Tag = ({ tag, tagOnly }) => {
  return (
    <>
      <span
        style={{
          display: "flex",
          float: tagOnly && "left",
          marginBottom: tagOnly ? 0 : 20,
          marginTop: 10,
          marginRight: tagOnly && 10,
        }}
      >
        <a
          href={`/home/tagged/${tag.name}`}
          className="tag"
          style={{ fontSize: tagOnly && 14 }}
        >
          {tag.name}
        </a>
        {!tagOnly && (
          <h3 style={{ color: "#B4B4B4", marginLeft: 15 }}>{tag.frequency}</h3>
        )}
      </span>
    </>
  );
};

export default Tag;
