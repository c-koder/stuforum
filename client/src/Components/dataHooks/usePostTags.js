import axios from "axios";
import { useState, useEffect } from "react";

const usePostTags = (post_id) => {
  const [tagResponse, setTagResponse] = useState(null);
  const fetchData = () => {
    axios
      .post("http://localhost:3001/getposttags", {
        post_id: post_id,
      })
      .then((res) => {
        setTagResponse(res.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { tagResponse };
};

export default usePostTags;
