import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children, username }) => {
    const [socket, setSocket] = useState(null);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [privateMessages, setPrivateMessages] = useState({});
    const [typingUsers, setTypingUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [notificationPermission, setNotificationPermission] = useState(false);

    useEffect(() => {
        // Request notification permission
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                setNotificationPermission(permission === 'granted');
            });
        }
    }, []);

    useEffect(() => {
        const SOCKET_URL = process.env.NODE_ENV === 'production'
            ? window.location.origin
            : 'http://localhost:3000';

        const newSocket = io(SOCKET_URL, {
            transports: ['websocket'],
            upgrade: false
        });

        newSocket.on('connect', () => {
            console.log('Connected to server');
            newSocket.emit('authenticate', username);
            // Load initial messages
            newSocket.emit('loadPreviousMessages', { page: 0, limit: 20 });
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        newSocket.on('userJoined', ({ users: connectedUsers }) => {
            setUsers(connectedUsers);
        });

        newSocket.on('userLeft', ({ users: connectedUsers }) => {
            setUsers(connectedUsers);
        });

        newSocket.on('message', (message) => {
            setMessages((prev) => [...prev, message]);
            showNotification('New Message', `${message.user}: ${message.text}`);
        });

        newSocket.on('privateMessage', (message) => {
            setPrivateMessages((prev) => ({
                ...prev,
                [message.senderId === socket?.id ? message.recipientId : message.senderId]: [
                    ...(prev[message.senderId === socket?.id ? message.recipientId : message.senderId] || []),
                    message
                ]
            }));
            showNotification('Private Message', `${message.senderName}: ${message.text}`);
        });

        newSocket.on('userTyping', ({ username: typingUser, isTyping }) => {
            setTypingUsers((prev) => {
                if (isTyping) {
                    return [...new Set([...prev, typingUser])];
                } else {
                    return prev.filter((user) => user !== typingUser);
                }
            });
        });

        newSocket.on('messageReaction', ({ messageId, reactions }) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === messageId ? { ...msg, reactions } : msg
                )
            );
        });

        newSocket.on('fileShared', (fileData) => {
            setMessages((prev) => [...prev, {
                ...fileData,
                type: 'file',
                text: `Shared a file: ${fileData.fileName}`
            }]);
            showNotification('File Shared', `${fileData.senderName} shared a file: ${fileData.fileName}`);
        });

        newSocket.on('searchResults', (results) => {
            setSearchResults(results);
        });

        newSocket.on('previousMessages', ({ messages: prevMessages, hasMore }) => {
            setMessages((prev) => [...prevMessages, ...prev]);
            setHasMoreMessages(hasMore);
            setCurrentPage((prev) => prev + 1);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [username]);

    const showNotification = (title, body) => {
        if (notificationPermission && document.hidden) {
            new Notification(title, { body });
        }
    };

    const sendMessage = (message) => {
        if (socket) {
            socket.emit('sendMessage', message);
        }
    };

    const sendPrivateMessage = (recipientId, message) => {
        if (socket) {
            socket.emit('sendPrivateMessage', { recipientId, message });
        }
    };

    const addReaction = (messageId, reaction) => {
        if (socket) {
            socket.emit('addReaction', { messageId, reaction });
        }
    };

    const shareFile = (file) => {
        if (socket && file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                socket.emit('shareFile', {
                    file: e.target.result,
                    fileName: file.name,
                    fileType: file.type
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const searchMessages = (query) => {
        if (socket) {
            socket.emit('searchMessages', query);
        }
    };

    const loadMoreMessages = () => {
        if (socket && hasMoreMessages) {
            socket.emit('loadPreviousMessages', {
                page: currentPage,
                limit: 20
            });
        }
    };

    const setTyping = (isTyping) => {
        if (socket) {
            socket.emit('typing', isTyping);
        }
    };

    const value = {
        socket,
        users,
        messages,
        privateMessages,
        typingUsers,
        searchResults,
        hasMoreMessages,
        sendMessage,
        sendPrivateMessage,
        addReaction,
        shareFile,
        searchMessages,
        loadMoreMessages,
        setTyping,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}; 