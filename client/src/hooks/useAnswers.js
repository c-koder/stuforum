import axios from "axios";
import { useState, useEffect } from "react";

const useAnswers = (user_id) => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .post("https://stuforum.herokuapp.com/api/user/getanswers", {
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
