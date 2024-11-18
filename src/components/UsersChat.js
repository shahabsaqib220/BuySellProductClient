import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../ContextAPI/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import './UserChat.css';
import io from 'socket.io-client';
import Modal from 'react-modal';
import { TextField, Button, CircularProgress, Alert } from '@mui/material';
import { GoTrash } from "react-icons/go";
import { MdSend, MdPerson } from "react-icons/md";
import { MdLock } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { BiCheckDouble } from "react-icons/bi";

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
  const [onlineStatuses, setOnlineStatuses] = useState({});
  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageIdToDelete, setMessageIdToDelete] = useState(null); 

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

  useEffect(() => {
    const markMessagesAsSeen = async () => {
      if (selectedReceiverId) {
        const unseenMessages = messages.filter(msg => !msg.seen && msg.senderId === selectedReceiverId);
        const messageIds = unseenMessages.map(msg => msg._id);
        
        if (messageIds.length > 0) {
          try {
            await axios.put('http://localhost:5000/api/conservation/markAsSeen', {
              messageIds
            });
            
            // Update the seen status in the state
            setMessages(prevMessages =>
              prevMessages.map(msg =>
                messageIds.includes(msg._id) ? { ...msg, seen: true } : msg
              )
            );
          } catch (error) {
            console.error("Error marking messages as seen:", error);
          }
        }
      }
    };
    
    markMessagesAsSeen();
  }, [selectedReceiverId, messages, user.id]);

  const handleDeleteMessage = (messageId) => {
    // This triggers the modal display for confirmation
    setMessageIdToDelete(messageId); // Set the message ID to delete
    setIsModalOpen(true); // Open the modal
  };
  

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/conservation/delete/message/${messageIdToDelete}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log(`Message ID to delete: ${messageIdToDelete}`);
        
        // Update local state after successful deletion
        setIsModalOpen(false);
        setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageIdToDelete));
      } else {
        console.error('Failed to delete the message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };
  


  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  if (loading) return <div className="flex justify-center mt-10"><CircularProgress /></div>;

  const selectedReceiver = receivers.find(receiver => receiver.contactId === selectedReceiverId);


  return (
    <div className="text-center p-4 sm:p-2 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Your Chats</h2>
      <div className="flex flex-wrap justify-center gap-4 mb-6">

        {/*  In this loop we are getting the receiver profile Images that displayed on the top! */}
     
    
      
        {receivers.map((receiver) => (
  <div
    key={receiver.contactId}
    className="text-center cursor-pointer"
    onClick={() => setSelectedReceiverId(receiver.contactId)}
  >
    <div className="relative">
      {receiver.profileImageUrl ? (
        <img
          src={receiver.profileImageUrl}
          alt={receiver.name}
          className="w-16 h-16 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-500 mx-auto object-cover"
        />
      ) : (
        <div className="w-16 h-16 sm:w-12 sm:h-12 text-gray-400 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
          <span>{receiver.name[0]}</span>
        </div>
      )}

      
    </div>
    <p className="text-sm mt-2">{receiver.name}</p>
  </div>
))}

      </div>
      <span className="bg-yellow-400 text-gray-950 p-2 rounded-lg shadow-lg flex items-center space-x-3 mb-4 mt-4">
        <MdLock className="font-semibold text-sm text-gray-950" />
        <span className="font-semibold text-sm">Your Messages, Fully Secured with End-to-End Encryption</span>
      </span>
      

      {selectedReceiver && (
        <div className="flex items-center gap-2 mb-4">
          {selectedReceiver.profileImageUrl ? (
            <img
              src={selectedReceiver.profileImageUrl}
              alt="Receiver"
              className="w-10 h-10 sm:w-8 sm:h-8 rounded-full object-cover"
            />
          ) : (
            <MdPerson className="w-10 h-10 sm:w-8 sm:h-8 text-gray-400" />
          )}
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
        selectedReceiver.profileImageUrl ? (
          <img
          src={selectedReceiver.profileImageUrl}
          alt="Receiver"
          className="w-8 h-8 rounded-full mr-2 object-cover"
          />
        ) : (
          <MdPerson className="w-8 h-8 text-gray-400 mr-2" />
        )
      )}

      <div
        className={`relative p-2 rounded-lg max-w-[60%] sm:max-w-[90%] break-words ${
          msg.senderId === user.id ? 'bg-yellow-300 text-black' : 'bg-gray-200 text-gray-800'
        }`}
        
        >

   
        {msg.message}
          
        
        {/* Display seen info if message is seen */}
        {msg.seen && (
          <p className="text-xs text-gray-700 mt-1 self-start flex">
            Seen {msg.seenAt ? `at ${new Date(msg.seenAt).toLocaleTimeString()}` : ""}
          </p>
        )}

        {msg.senderId === user.id && (
                   <button
                   onClick={() => handleDeleteMessage(msg._id)}
                   className="text-black font-light flex hover:text-red-500 mt-3 justify-center items-center cursor-pointer"
                 >
                  <RxCross2/>
                   Delete Message
                 </button>
                 )}
        
      </div>

      {msg.senderId === user.id && (
        user.profileImageUrl ? (
          <img
          src={user.profileImageUrl}
          alt="Sender"
          className="w-8 h-8 rounded-full ml-2 object-cover"
          />
        ) : (
          <MdPerson className="w-8 h-8 text-gray-400 ml-2" />
        )
      )}
     
    
    </div>
  ))}

  {isTyping && (
    <div className="typing-indicator flex justify-start gap-3 ml-10 mt-4">
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
          className="w-10 ml-3 flex items-center justify-center cursor-pointer rounded-full text-blue-600"
          disabled={sending}
        >
          <MdSend size={30} />
        </div>







      </div>
{/* Modal for confirmation (Tailwind CSS) */}
{isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to delete this message?</h3>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiversList;
