import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import axios from 'axios';
import { addMessage } from '../Redux/messageSlice';
import Avatar from '@mui/material/Avatar';
import { CircularProgress } from '@mui/material';
import { BiCheckDouble } from "react-icons/bi";
import './UserChat.css';

const socket = io('http://localhost:5000');

const UserChat = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const ad = useSelector((state) => state.user.ad);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [senderProfile, setSenderProfile] = useState(null);
    const [receiverProfile, setReceiverProfile] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    const chatWindowRef = useRef(null);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const senderProfileData = await axios.get(`http://localhost:5000/api/user/conversation/users/data/${user.id}`);
                const receiverProfileData = await axios.get(`http://localhost:5000/api/user/conversation/users/data/${ad.userId._id}`);
                setSenderProfile(senderProfileData.data);
                setReceiverProfile(receiverProfileData.data);
            } catch (error) {
                console.error('Error fetching profiles:', error);
            }
        };

        if (user && ad) {
            fetchProfiles();
            const room = [user.id, ad.userId._id].sort().join('_');
            socket.emit('joinRoom', { senderId: user.id, receiverId: ad.userId._id });

            axios.get(`http://localhost:5000/api/user/conversation/history/${user.id}/${ad.userId._id}`)
                .then(response => setChatHistory(response.data))
                .catch(error => console.error('Error fetching chat history:', error));
        }

        socket.on('receiveMessage', (data) => {
            setChatHistory(prevMessages => [...prevMessages, data]);
            dispatch(addMessage(data));
            setIsTyping(false);
        });

        socket.on('userTyping', ({ senderId }) => {
            if (senderId !== user.id) {
                setIsTyping(true);
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
            }
        });

        socket.on('messageSeen', (seenMessageId) => {
            setChatHistory(prevMessages =>
                prevMessages.map(msg =>
                    msg._id === seenMessageId ? { ...msg, seen: true } : msg
                )
            );
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('userTyping');
            socket.off('messageSeen');
        };
    }, [user, ad, dispatch]);

    const handleSendMessage = () => {
        if (message.trim()) {
            const messageData = {
                senderId: user.id,
                receiverId: ad.userId._id,
                message,
                timestamp: new Date(),
            };
    
            socket.emit('sendMessage', messageData);
            dispatch(addMessage(messageData));
            setMessage('');
            socket.emit('stopTyping', { senderId: user.id, receiverId: ad.userId._id });
        }
    };
    

    const handleTyping = (e) => {
        setMessage(e.target.value);
        socket.emit('userTyping', { senderId: user.id, receiverId: ad.userId._id });
    };

    const handleScroll = () => {
        if (
            chatWindowRef.current.scrollTop + chatWindowRef.current.clientHeight >=
            chatWindowRef.current.scrollHeight
        ) {
            const unseenMessages = chatHistory.filter(
                msg => msg.senderId !== user.id && !msg.seen
            );
            unseenMessages.forEach((msg) => {
                socket.emit('messageSeen', { messageId: msg._id, receiverId: user.id });
            });
        }
    };

    if (!senderProfile || !receiverProfile) {
        return <CircularProgress />;
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                {receiverProfile.profileImageUrl ? (
                    <img
                        src={receiverProfile.profileImageUrl}
                        alt={receiverProfile.name}
                        className="w-10 h-10 rounded-full mr-2"
                    />
                ) : (
                    <Avatar className="w-10 h-10 mr-2">
                        {receiverProfile.name.charAt(0).toUpperCase()}
                    </Avatar>
                )}
                Chat with {receiverProfile.name}
            </h2>
            <div
                ref={chatWindowRef}
                onScroll={handleScroll}
                className="chat-window h-80 overflow-y-scroll bg-gray-100 p-4 rounded-lg"
            >
                {chatHistory.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-start my-2 ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.senderId !== user.id && (
                            <Avatar src={receiverProfile.profileImageUrl} className="mr-2" />
                        )}
                        <div
                            className={`p-3 rounded-lg shadow-md max-w-xs ${
                                msg.senderId === user.id ? 'bg-yellow-500 text-black ml-auto' : 'bg-gray-200'
                            }`}
                        >
                            <p>{msg.message}</p>
                            
                            {msg.senderId === user.id && msg.seen && (
                                
                                <div className="flex items-center text-green-800 text-xs">
                                <BiCheckDouble className="text-xl" />
                                <span className="ml-1">Seen</span>
                            </div>
                            )}
                            <small className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</small>
                        </div>
                        {msg.senderId === user.id && (
                            <Avatar src={senderProfile.profileImageUrl} className="ml-2" />
                        )}
                    </div>
                ))}
                {isTyping && (
                    <div className="flex items-center my-2">
                        <Avatar src={receiverProfile.profileImageUrl} className="mr-2" />
                        <div className="p-2 rounded-lg shadow-md bg-gray-200 max-w-xs">
                            <TypingIndicator />
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center mt-4 border border-gray-300 rounded-lg shadow-sm overflow-hidden">
    <input
        type="text"
        value={message}
        onChange={handleTyping}
        placeholder="Type your message..."
        className="p-3 w-full border-none outline-none focus:ring-2 focus:ring-blue-300"
    />
    <button
        onClick={handleSendMessage}
        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 transition duration-300 ease-in-out"
    >
        <span className="mr-2">Send</span>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path d="M2.003 5.884l8.623 3.13-2.635 8.757 1.764-.744L16.08 4.002 2.003 5.884z" />
        </svg>
    </button>
</div>

        </div>
    );
};

const TypingIndicator = () => (
    <div className="typing-indicator">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
    </div>
);

export default UserChat;
