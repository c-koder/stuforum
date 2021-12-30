import { useState } from "react";

const TagsInput = (props) => {
  const [tags, setTags] = useState([]);
  const removeTags = (indexToRemove) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)]);
  };
  const addTags = (e) => {
    if (e.target.value != "") {
      setTags([...tags, e.target.value]);
      props.setSelectedTags([...tags, e.target.value]);
      e.target.value = "";
    }
    setTagField("");
  };

  const [tagField, setTagField] = useState("");

  return (
    <div className="tags-input">
      <ul id="tags">
        {tags.map((tag, index) => (
          <li key={index} className="tag">
            <span className="tag-title">{tag}</span>
            <span className="tag-close-icon" onClick={() => removeTags(index)}>
              x
            </span>
          </li>
        ))}
      </ul>
      <input
        disabled={tags.length >= 5 ? true : false}
        style={{ border: "none" }}
        type="text"
        onKeyUp={(e) => (e.key == "Enter" ? addTags(e) : null)}
        value={tagField}
        onChange={(e) => {
          let value = e.target.value;
          value = value.replace(/[^0-9a-z@&#-]/, "");
          setTagField(value);
        }}
        placeholder="Add up to 5 tags (press enter per each) to describe what your question is about"
      />
    </div>
  );
};

export default TagsInput;
