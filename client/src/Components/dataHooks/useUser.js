import axios from "axios";
import { useState, useEffect } from "react";

const useUser = (id) => {
  const [userResponse, setUserResponse] = useState(null);
  const fetchData = () => {
    axios.post("http://localhost:3001/getuser", { id: id }).then((res) => {
      setUserResponse(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { userResponse };
};

export default useUser;
