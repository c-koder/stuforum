import axios from "axios";
import { useState, useEffect } from "react";
import { PORT } from "../constants/Port";

const useAnswers = (user_id) => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .post(`${PORT}user/getanswers`, {
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

export default useAnswers;
