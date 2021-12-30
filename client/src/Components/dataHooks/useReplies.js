import axios from "axios";
import { useState, useEffect } from "react";

const useReplies = (post_id) => {
  const [replies, setReplies] = useState(null);
  const [childReplies, setChildReplies] = useState(null);

  const fetchData = () => {
    axios
      .post("http://localhost:3001/getreplies", { post_id: post_id })
      .then((res) => {
        setReplies(res.data.replies);
        setChildReplies(res.data.child_replies);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { replies, childReplies };
};

export default useReplies;
