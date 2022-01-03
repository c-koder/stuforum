import { useEffect, useState } from "react";
import Posts from "../Components/posts/Posts";
import RightBar from "../Components/RightBar";
import LeftBarUser from "../Components/LeftBarUser";
import { motion } from "framer-motion";
import { useParams } from "react-router";

const ViewUser = () => {
  const { name } = useParams();
  const [tags, setTags] = useState([
    {
      id: 1,
      name: "Web",
      frequency: 422,
    },
    {
      id: 2,
      name: "Technology",
      frequency: 326,
    },
    {
      id: 3,
      name: "Web Development",
      frequency: 127,
    },
  ]);
  const [posts, setPosts] = useState([
    {
      id: 1,
      votes: 132,
      userVoted: "useful",
      question: "What is the best tech stack to develop a website?",
      usedTags: tags,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tempor nisl nibh, sit amet imperdiet mauris hendrerit quis. Sed lorem risus, blandit id pulvinar in, eleifend in diam. Mauris est mauris, placerat a rutrum semper, hendrerit id lectus. Sed bibendum libero sit amet faucibus pulvinar. Proin sagittis nunc sit amet faucibus egestas. Nunc ligula libero, tincidunt ut lorem quis, luctus dictum diam. Aliquam metus felis, consectetur id laoreet vel, convallis vel felis. Vivamus nunc turpis, mollis vitae lobortis sed, porta et arcu.",
      postedBy: "Lorem Ipsum",
      time: "9hr ago",
      comments: 12,
      label: null,
    },
    {
      id: 2,
      votes: 67,
      userVoted: "useless",
      question:
        "What is the best tech stack to develop a website tech stack to develop a website tech stack to develop a website tech stack to develop a website tech stack to develop a website tech stack to develop a website?",
      usedTags: tags,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tempor nisl nibh, sit amet imperdiet mauris hendrerit quis. Sed lorem risus, blandit id pulvinar in, eleifend in diam. Mauris est mauris, placerat a rutrum semper, hendrerit id lectus. Sed bibendum libero sit amet faucibus pulvinar. Proin sagittis nunc sit amet faucibus egestas. Nunc ligula libero, tincidunt ut lorem quis, luctus dictum diam. Aliquam metus felis, consectetur id laoreet vel, convallis vel felis. Vivamus nunc turpis, mollis vitae lobortis sed, porta et arcu. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tempor nisl nibh, sit amet imperdiet mauris hendrerit quis. Sed lorem risus, blandit id pulvinar in, eleifend in diam. Mauris est mauris, placerat a rutrum semper, hendrerit id lectus. Sed bibendum libero sit amet faucibus pulvinar. Proin sagittis nunc sit amet faucibus egestas. Nunc ligula libero, tincidunt ut lorem quis, luctus dictum diam. Aliquam metus felis, consectetur id laoreet vel, convallis vel felis. Vivamus nunc turpis, mollis vitae lobortis sed, porta et arcu.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tempor nisl nibh, sit amet imperdiet mauris hendrerit quis. Sed lorem risus, blandit id pulvinar in, eleifend in diam. Mauris est mauris, placerat a rutrum semper, hendrerit id lectus. Sed bibendum libero sit amet faucibus pulvinar. Proin sagittis nunc sit amet faucibus egestas. Nunc ligula libero, tincidunt ut lorem quis, luctus dictum diam. Aliquam metus felis, consectetur id laoreet vel, convallis vel felis. Vivamus nunc turpis, mollis vitae lobortis sed, porta et arcu.",
      postedBy: "Lorem Ipsum",
      time: "9hr ago",
      comments: 12,
      label: "Urgent",
    },
    {
      id: 3,
      votes: -3,
      userVoted: "",
      question:
        "What is the best tech stack to develop a website tech stack to develop a website tech stack to develop a website?",
      usedTags: tags,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tempor nisl nibh, sit amet imperdiet mauris hendrerit quis. Sed lorem risus, blandit id pulvinar in, eleifend in diam. Mauris est mauris, placerat a rutrum semper, hendrerit id lectus. Sed bibendum libero sit amet faucibus pulvinar. Proin sagittis nunc sit amet faucibus egestas. Nunc ligula libero, tincidunt ut lorem quis, luctus dictum diam. Aliquam metus felis, consectetur id laoreet vel, convallis vel felis. Vivamus nunc turpis, mollis vitae lobortis sed, porta et arcu.",
      postedBy: "Lorem Ipsum",
      time: "9hr ago",
      comments: 12,
      label: "Answered",
    },
  ]);

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
    document.title = name + " - stuforum";
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
          <LeftBarUser user={name} />
        </div>
        <div className="container-div" style={{ width: "225%" }}>
          <Posts posts={posts} singlePost={false} postedBy={name} />
        </div>
        <div className="container-div">
          <RightBar activeTab={""} />
        </div>
      </motion.div>
    </>
  );
};

export default ViewUser;
