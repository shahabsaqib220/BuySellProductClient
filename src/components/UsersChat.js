import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../ContextAPI/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import './UserChat.css';
import io from 'socket.io-client';
import { TextField, Button, CircularProgress } from '@mui/material';
import { MdSend } from "react-icons/md";


const socket = io('http://localhost:5000');

const ReceiversList = () => {
  const { user } = useAuth();
  const [receivers, setReceivers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedReceiverId, setSelectedReceiverId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);

  const typingTimeout = useRef(null); 
  const dispatch = useDispatch();
  const ad = useSelector((state) => state.user.ad);

  useEffect(() => {
    if (user?.id) {
      socket.emit('joinRoom', user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchReceivers = async () => {
      if (user?.id) {
        try {
          const response = await axios.get(`http://localhost:5000/api/receivers/profile/image/receivers/${user.id}`);
          setReceivers(response.data);
        } catch (error) {
          console.error("Error fetching receivers:", error);
        }
      }
      setLoading(false);
    };
    fetchReceivers();
  }, [user?.id]);

  useEffect(() => {
    if (ad?.userId?._id) {
      setSelectedReceiverId(ad.userId._id);
    }
  }, [ad]);

  useEffect(() => {
    const fetchConversationHistory = async () => {
      if (!selectedReceiverId) return;
      try {
        const response = await axios.get(`http://localhost:5000/api/conservation/history/${user.id}/${selectedReceiverId}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching message history:", error);
      }
    };

    if (selectedReceiverId) {
      fetchConversationHistory();
    }
  }, [selectedReceiverId, user.id]);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      if (message.senderId === selectedReceiverId || message.receiverId === selectedReceiverId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on('typing', () => setIsTyping(true));
    socket.on('stopTyping', () => setIsTyping(false));

    return () => {
      socket.off('receiveMessage');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [selectedReceiverId]);

  const handleTyping = () => {
    if (!messageContent) return;

    socket.emit('startTyping', { receiverId: selectedReceiverId });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('stopTyping', { receiverId: selectedReceiverId });
    }, 1000);
  };

  const handleMessageSent = async () => {
    if (!messageContent.trim() || !selectedReceiverId) return;

    setSending(true);
    const messageData = {
      senderId: user.id,
      receiverId: selectedReceiverId,
      message: messageContent,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/conservation/send', messageData);
      setMessages((prev) => [...prev, response.data]);
      setMessageContent('');

      socket.emit('sendMessage', response.data);
      socket.emit('stopTyping', { receiverId: selectedReceiverId });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="flex justify-center mt-10"><CircularProgress /></div>;

  const selectedReceiver = receivers.find(receiver => receiver.contactId === selectedReceiverId);

  return (
    <div className="text-center p-4 sm:p-2 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Your Chats</h2>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {receivers.map((receiver) => (
          <div
            key={receiver.contactId}
            className="text-center cursor-pointer"
            onClick={() => setSelectedReceiverId(receiver.contactId)}
          >
            <div className="relative">
              <img
                src={receiver.profileImageUrl}
                alt={receiver.name}
                className="w-16 h-16 sm:w-12 sm:h-12 rounded-full border-2 border-blue-500 mx-auto object-cover"
              />
            </div>
            <p className="text-sm mt-2">{receiver.name}</p>
          </div>
        ))}
      </div>

      {selectedReceiver && (
        <div className="flex items-center gap-2 mb-4">
          <img
            src={selectedReceiver.profileImageUrl}
            alt="Receiver"
            className="w-10 h-10 sm:w-8 sm:h-8 rounded-full object-cover"
          />
          <span className="text-gray-700 font-bold">Chat with {selectedReceiver.name}</span>
        </div>
      )}

      <div className="max-h-96 overflow-y-auto p-4 border border-gray-300 rounded mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-center mb-2 ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
          >
            {msg.senderId !== user.id && selectedReceiver && (
              <img
                src={selectedReceiver.profileImageUrl}
                alt="Receiver"
                className="w-8 h-8 rounded-full mr-2 object-cover"
              />
            )}
            <div
              className={`p-2 rounded-lg max-w-[70%] sm:max-w-[90%] break-words ${
                msg.senderId === user.id ? 'bg-yellow-300 text-black' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.message}
            </div>
            {msg.senderId === user.id && (
              <img
                src={user.profileImageUrl}
                alt="Sender"
                className="w-8 h-8 rounded-full ml-2 object-cover"
              />
            )}
          </div>
        ))}

        {isTyping && (
          <div className="typing-indicator flex justify-start gap-3 mt-4">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
      </div>

      <div className="flex items-center">
        <TextField
          variant="outlined"
          placeholder="Type a message..."
          value={messageContent}
          onChange={(e) => { setMessageContent(e.target.value); handleTyping(); }}
          className="flex-1"
          size="small"
        />



<div
        onClick={handleMessageSent}
        className="w-10 ml-3 h-10 flex items-center justify-center bg-yellow-500 rounded-full cursor-pointer"
      >
        {sending ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <MdSend className="text-white text-xl" />
        )}
      </div>
      </div>
    </div>
  );
};

export default ReceiversList;
