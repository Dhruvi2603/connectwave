import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../state";

const useGetRealTimeMessage = () => {
    const dispatch = useDispatch();
    const socket = useSelector((state) => state.socket);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            console.log('Received new message:', newMessage);
            dispatch(addMessage({ message: newMessage }));
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket, dispatch]);
};

export default useGetRealTimeMessage;
