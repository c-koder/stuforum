import axios from "axios";
import { useState, useEffect } from "react";

const usePostData = (post_id, user_id) => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .post("http://localhost:3001/getpostdata", {
        post_id: post_id,
        user_id: user_id,
      })
      .then((res) => {
        setResponse(res.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { response };
};

export default usePostData;
