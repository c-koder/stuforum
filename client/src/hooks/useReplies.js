import axios from "axios";
import { useState, useEffect } from "react";
import { PORT } from "../constants/Port";

const useReplies = (post_id) => {
  const [replyResponse, setReplyResponse] = useState(null);

  const fetchData = () => {
    axios
      .post(`${PORT}reply/getreplies`, {
        post_id: post_id,
      })
      .then((res) => {
        setReplyResponse(res.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { replyResponse };
};

export default useReplies;
