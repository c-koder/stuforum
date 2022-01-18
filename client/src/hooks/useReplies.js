import axios from "axios";
import { useState, useEffect } from "react";

const useReplies = (post_id) => {
  const [replyResponse, setReplyResponse] = useState(null);

  const fetchData = () => {
    axios
      .post("http://localhost:3001/reply/getreplies", { post_id: post_id })
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
