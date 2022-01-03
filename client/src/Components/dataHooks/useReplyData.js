import axios from "axios";
import { useState, useEffect } from "react";

const useReplyData = (parent_id, child_id, user_id) => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .post("http://localhost:3001/getreplydata", {
        parent_id: parent_id,
        child_id: child_id,
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

export default useReplyData;
