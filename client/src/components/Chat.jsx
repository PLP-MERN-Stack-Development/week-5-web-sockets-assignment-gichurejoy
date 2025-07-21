import { useState } from 'react';
import { Box, Paper, Menu } from '@mui/material';
import { useSocket } from '../context/SocketContext';
import UserList from './UserList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const REACTIONS = ['👍', '❤️', '😄', '😮', '😢', '😡'];

const Chat = ({ username }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [reactionAnchorEl, setReactionAnchorEl] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const {
        messages,
        privateMessages,
        users,
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
    } = useSocket();

    const handleSend = (message) => {
        if (selectedUser) {
            sendPrivateMessage(selectedUser.id, message);
        } else {
            sendMessage(message);
        }
    };

    const handleReactionClick = (message, event) => {
        setSelectedMessage(message);
        setReactionAnchorEl(event.currentTarget);
    };

    const handleAddReaction = (reaction) => {
        if (selectedMessage) {
            addReaction(selectedMessage.id, reaction);
        }
        setReactionAnchorEl(null);
    };

    const displayMessages = selectedUser
        ? (privateMessages[selectedUser.id] || [])
        : (searchQuery ? searchResults : messages);

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 2 }}>
            <Paper sx={{ mb: 2 }}>
                <UserList
                    onUserSelect={setSelectedUser}
                    selectedUser={selectedUser}
                />
            </Paper>

            <Paper sx={{ flex: 1, mb: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <MessageList
                    messages={displayMessages}
                    username={username}
                    onReactionClick={handleReactionClick}
                    onLoadMore={loadMoreMessages}
                    hasMore={hasMoreMessages}
                    typingUsers={typingUsers}
                />
            </Paper>

            <Paper>
                <MessageInput
                    onSend={handleSend}
                    onFileUpload={shareFile}
                    onTyping={setTyping}
                    placeholder={selectedUser ? `Message ${selectedUser.username}...` : "Type a message..."}
                />
            </Paper>

            <Menu
                anchorEl={reactionAnchorEl}
                open={Boolean(reactionAnchorEl)}
                onClose={() => setReactionAnchorEl(null)}
            >
                <Box sx={{ display: 'flex', p: 1 }}>
                    {REACTIONS.map(reaction => (
                        <Box
                            key={reaction}
                            sx={{
                                p: 0.5,
                                cursor: 'pointer',
                                '&:hover': { bgcolor: 'action.hover' },
                                borderRadius: 1,
                            }}
                            onClick={() => handleAddReaction(reaction)}
                        >
                            {reaction}
                        </Box>
                    ))}
                </Box>
            </Menu>
        </Box>
    );
};

export default Chat; 