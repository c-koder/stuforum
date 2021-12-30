import { useEffect, useState } from "react";
import RightBar from "../Components/RightBar";
import ShowTags from "../Components/tags/Tags";
import { motion } from "framer-motion";
import useAllTags from "../Components/dataHooks/useAllTags";

const Tags = () => {
  const { response } = useAllTags();
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (response !== null) {
      setTags(response);
    }
  }, [response]);

  const containerVariants = {
    hidden: {
      opacity: 0.1,
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      transition: { ease: "easeOut" },
    },
  };

  const title = "Tags";
  useEffect(() => {
    document.title = title;
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
        <div className="container-div" style={{ width: "346%" }}>
          <div
            className="whiteContainer"
            style={{ marginTop: 0, padding: "40px" }}
          >
            <h2>Tags</h2>
            <p style={{ margin: "10px 0 10px 0", width: "60%" }}>
              A tag is a keyword or label that categorizes your question with
              other, similar questions. Using the right tags makes it easier for
              others to find and answer your question.
            </p>
            <ShowTags tags={tags} tagOnly={true} display={true} />
          </div>
        </div>
        <div className="container-div">
          <RightBar activeTab={"tags"} />
        </div>
      </motion.div>
    </>
  );
};

export default Tags;
