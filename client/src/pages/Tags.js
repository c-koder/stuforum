import { useEffect, useState } from "react";
import RightBar from "../Components/RightBar";
import ShowTags from "../Components/tags/Tags";
import { motion } from "framer-motion";
import useAllTags from "../hooks/useAllTags";
import useWindowDimensions from "../hooks/useWindowDimensions";

const Tags = () => {
  const { width } = useWindowDimensions();
  const { response } = useAllTags();
  const [tags, setTags] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (response !== null) {
      setTags(response);
    }
    setLoading(false);
  }, [response]);

  const containerVariants = {
    hidden: {
      scale: 0.96,
    },
    visible: {
      scale: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      transition: { ease: "easeIn" },
    },
  };

  useEffect(() => {
    document.title = "Tags";
  }, []);

  return (
    <>
      <motion.div
        className={"container"}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div
          className="container-div"
          style={{
            width: "346%",
            margin: width < 900 && "-80px 0px 0px 0px",
            marginTop: width < 900 ? "-40px" : 0,
          }}
        >
          {!loading && (
            <div
              className="whiteContainer"
              style={{ marginTop: 0, padding: "40px" }}
            >
              <h2>Tags</h2>
              <p style={{ margin: "10px 0 10px 0", width: "90%" }}>
                A tag is a keyword or label that categorizes your question with
                other, similar questions. Using the right tags makes it easier
                for others to find and answer your question.
              </p>
              <ShowTags tags={tags} tagOnly={true} display={true} />
            </div>
          )}
        </div>
        <div
          className="container-div"
          style={{ display: width < 900 && "none" }}
        >
          <RightBar activeTab={"tags"} />
        </div>
      </motion.div>
    </>
  );
};

export default Tags;
