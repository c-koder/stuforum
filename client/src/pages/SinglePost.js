import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router";
import { motion } from "framer-motion";

import useSinglePost from "../hooks/useSinglePost";
import useReplies from "../hooks/useReplies";
import { AuthContext } from "../helpers/AuthContext";
import CommentBox from "../Components/CommentBox";
import Replies from "../Components/replies/Replies";
import FilterMenu from "../Components/FilterMenu";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { PORT } from "../constants/Port";
import Post from "../Components/posts/Post";
import RightBar from "../Components/RightBar";
import { containerVariants } from "../constants/Anim";

const SinglePost = ({ socket }) => {
  const { width } = useWindowDimensions();
  const { authState } = useContext(AuthContext);
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  let navigate = useNavigate();

  useEffect(() => {
    axios
      .post("${PORT}post/postexists", {
        post_id: id,
      })
      .then((res) => {
        res.data.message !== "exists" && navigate("/404");
      });
    {
    }
  }, []);

  const [post, setPost] = useState();
  const [tags, setTags] = useState([]);
  const [postPref, setPostPref] = useState([]);
  const [commentCount, setCommentCount] = useState();
  const [answered, setAnswered] = useState(false);

  const { response } = useSinglePost(id);

  useEffect(() => {
    if (response !== null) {
      setPost(response.post);
      setTags(response.tags);
      setPostPref(response.post_pref);
      setCommentCount(response.post.comments);
      setAnswered(response.post.answered == 1 ? true : false);
    }
    setLoading(false);
  }, [response, post]);

  const { replyResponse } = useReplies(id);
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    if (replyResponse != null) {
      const populateReplies = (reply) => {
        const childs = replyResponse.filter(
          (childObj) => childObj["parent_id"] === reply["id"]
        );
        let childArray = reply.replies === null ? [] : reply.replies;
        childArray = [...childArray, ...childs];
        replyResponse.filter((reply) => reply["parent_id"] != null);
        return { ...reply, replies: childArray };
      };

      const result = replyResponse.map(populateReplies);
      setReplies(result.filter((reply) => reply.parent_id === null));
    }
  }, [replyResponse]);

  const sortReplies = (sortBy) => {
    let obj = [...replies];

    if (sortBy == "dateasc") {
      obj.sort((a, b) => a.id - b.id);
    } else if (sortBy == "datedesc") {
      obj.sort((a, b) => b.id - a.id);
    } else if (sortBy == "likesasc") {
      obj.sort((a, b) => a.likes - b.likes);
    } else if (sortBy == "likesdesc") {
      obj.sort((a, b) => b.likes - a.likes);
    }

    setReplies(obj);
  };

  const addReply = (data) => {
    const newReply = data;
    if (data.replied_to == null) {
      setReplies([...replies, newReply]);
    } else {
      setReplies(
        replies.map((reply) => {
          if (reply.id == data.parent_id) {
            let childArray = reply.replies === null ? [] : reply.replies;
            childArray = [...childArray, newReply];
            return { ...reply, replies: childArray };
          } else {
            return reply;
          }
        })
      );
    }
    setCommentCount(commentCount + 1);
  };

  const onDelete = (reply_id, parent_id) => {
    if (parent_id != null) {
      handleChildReplyDelete(reply_id);
      setCommentCount(commentCount - 1);
    } else {
      axios.post(`${PORT}reply/deletereply`, {
        reply_id: reply_id,
        post_id: id,
        delete_child_only: false,
      });
      let deleteCount = 1;
      replies.map((reply) => {
        if (reply.id == reply_id && reply.replies != null)
          deleteCount += reply.replies.length;
        return;
      });
      setCommentCount(commentCount - deleteCount);
      setReplies(replies.filter((reply) => reply.id !== reply_id));
    }
  };

  const handleChildReplyDelete = (reply_id) => {
    axios.post(`${PORT}reply/deletereply`, {
      reply_id: reply_id,
      post_id: id,
      delete_child_only: true,
    });
    setReplies(
      replies.map((reply) => {
        const { id, replies } = reply;
        return {
          ...reply,
          replies: replies.filter(({ id }) => id !== reply_id),
        };
      })
    );
  };

  const deletePost = (id) => {
    axios
      .post("${PORT}post/deletepost", {
        post_id: id,
      })
      .then((res) => {
        if (res.data.message == "success") navigate("/home");
      });
  };

  const updateStatus = (id, status, new_status) => {
    axios.post(`${PORT}post/updatepoststatus`, {
      post_id: id,
      status: status,
      new_status: new_status,
    });
  };

  const toggleUrgent = (id) => {
    updateStatus(post.id, "urgent", post.urgent);
    window.location.reload();
  };

  const toggleAnswered = (id) => {
    updateStatus(post.id, "answered", post.answered);
    window.location.reload();
  };

  useEffect(() => {
    if (post) document.title = post.question;
  });

  return (
    <div>
      {!loading && post && (
        <motion.div
          className="container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="row">
            <div className={width > 992 ? "col-9" : "col"}>
              <Post
                post={post}
                tags={tags}
                postPref={postPref[0]}
                singlePost={true}
                commentCount={commentCount}
                onToggleUrgent={toggleUrgent}
                onToggleAnswered={toggleAnswered}
                onDelete={deletePost}
                socket={socket}
              />
              <CommentBox
                addReply={addReply}
                replyTo={null}
                parent_id={null}
                user_id={authState.id}
                nick_name={authState.nick_name}
                post_id={id}
                answered={answered}
                socket={socket}
              />

              {/* {replies.length > 0 && (
                <div style={{ marginBottom: -20 }}>
                  <FilterMenu
                    show={true}
                    replies={true}
                    sortData={sortReplies}
                  />
                  <div className="info-label" style={{ width: "8%" }}>
                    Sort By
                  </div>
                </div>
              )} */}
              <br />
              <Replies
                replies={replies}
                onDelete={onDelete}
                addReply={addReply}
                answered={answered}
                socket={socket}
              />
            </div>
            <div className="col-3" style={{ display: width < 900 && "none" }}>
              <RightBar activeTab={""} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SinglePost;
