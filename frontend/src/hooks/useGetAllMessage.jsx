import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages, setError } from "../state";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.selectedUser);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    if (!selectedUser?._id || !token) {
      console.error("Missing required parameters: selectedUser or token");
      dispatch(setError({ error: "Selected user or token is missing" }));
      return;
    }

    const fetchAllMessage = async () => {
      try {
        const res = await axios.get(
          `https://connectwave-backend.onrender.com/message/${selectedUser._id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          console.log("Messages fetched:", res.data.messages);
          dispatch(setMessages(res.data.messages));
        } else {
          console.error("Failed to fetch messages:", res.data.message);
          dispatch(setError({ error: res.data.message }));
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        dispatch(setError({ error: error.message }));
      }
    };

    fetchAllMessage();
  }, [selectedUser?._id, token, dispatch]);

  return null;
};

export default useGetAllMessage;
