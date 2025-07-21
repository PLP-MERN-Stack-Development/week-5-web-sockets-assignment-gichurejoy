import { useState, useRef } from 'react';
import {
    Box,
    TextField,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import FileUpload from './FileUpload';
import ReactionPicker from './ReactionPicker';

const MessageInput = ({
    onSend,
    onFileUpload,
    placeholder = 'Type a message...',
    onTyping,
}) => {
    const [message, setMessage] = useState('');
    const typingTimeoutRef = useRef(null);

    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message.trim());
            setMessage('');
            if (onTyping) {
                onTyping(false);
            }
        }
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);

        if (onTyping) {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            onTyping(true);
            typingTimeoutRef.current = setTimeout(() => {
                onTyping(false);
            }, 1000);
        }
    };

    const handleEmojiSelect = (emoji) => {
        setMessage((prev) => prev + emoji);
    };

    return (
        <Box sx={{ p: 2 }}>
            <form onSubmit={handleSend}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <FileUpload onFileSelect={onFileUpload} />
                    <ReactionPicker onSelect={handleEmojiSelect} />
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={placeholder}
                        value={message}
                        onChange={handleMessageChange}
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            },
                        }}
                    />
                    <IconButton
                        type="submit"
                        color="primary"
                        disabled={!message.trim()}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            </form>
        </Box>
    );
};

export default MessageInput; 