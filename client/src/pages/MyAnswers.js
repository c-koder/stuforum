import { useEffect, useState } from "react";
import RightBar from "../Components/RightBar";
import LeftBar from "../Components/LeftBar";
import Answer from "../Components/Answer";
import { motion } from "framer-motion";

const MyAnswers = () => {
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

  // const deleteReply = (id) => {
  //   setReplies(replies.filter((reply) => reply.id !== id));
  //   console.log(replies.length);
  // };

  useEffect(() => {
    document.title = "My Answers";
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
        <div className="container-div">
          <LeftBar />
        </div>
        <div className="container-div" style={{ width: "225%" }}>
          {/* <Answer
            posts={posts}
            singlePost={false}
            replies={replies}
            onDelete={deleteReply}
            repliedBy={"Lorem Ipsum Ipsum"}
          /> */}
        </div>
        <div className="container-div">
          <RightBar activeTab={"answers"} />
        </div>
      </motion.div>
    </>
  );
};

export default MyAnswers;
