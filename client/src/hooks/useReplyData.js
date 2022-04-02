import axios from "axios";
import { useState, useEffect } from "react";
import { PORT } from "../constants/Port";

const useReplyData = (reply_id, user_id) => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .post(`${PORT}reply/getreplypref`, {
        user_id: user_id,
        reply_id: reply_id,
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

export default useReplyData;
