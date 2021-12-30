import axios from "axios";
import { useState, useEffect } from "react";

const usePostPrefs = (post_id, user_id) => {
  const [prefResponse, setPrefResponse] = useState(null);
  const fetchData = () => {
    axios
      .post("http://localhost:3001/userpref", {
        post_id: post_id,
        user_id: user_id,
      })
      .then((res) => {
        setPrefResponse(res.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { prefResponse };
};

export default usePostPrefs;
