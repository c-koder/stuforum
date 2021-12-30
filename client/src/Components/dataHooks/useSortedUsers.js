import axios from "axios";
import { useState, useEffect } from "react";

const useSortedUsers = () => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios.post("http://localhost:3001/getsortedusers").then((res) => {
      setResponse(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { response };
};

export default useSortedUsers;
