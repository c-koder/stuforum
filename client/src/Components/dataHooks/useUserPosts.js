import axios from "axios";
import { useState, useEffect } from "react";

const useUserPosts = (user_id) => {
  const [userQuestionsResponse, setUserQuestionsResponse] = useState(null);
  const fetchData = () => {
    axios
      .post("http://localhost:3001/getuserposts", { user_id: user_id })
      .then((res) => {
        setUserQuestionsResponse(res.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { userQuestionsResponse };
};

export default useUserPosts;
