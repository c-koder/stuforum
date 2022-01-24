import axios from "axios";
import { useState, useEffect } from "react";

const useReplies = (post_id) => {
  const [replyResponse, setReplyResponse] = useState(null);

  const fetchData = () => {
    axios
      .post("https://stuforum.herokuapp.com/api/reply/getreplies", {
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
