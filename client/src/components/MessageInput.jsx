import { useState, useRef } from 'react';
import {
    Box,
    TextField,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
} from '@mui/material';
import {
    Send as SendIcon,
    AttachFile as AttachFileIcon,
    EmojiEmotions as EmojiIcon,
} from '@mui/icons-material';

const EMOJI_LIST = ['👍', '❤️', '😄', '😮', '😢', '😡', '👋', '🎉', '🤔', '👀'];

const MessageInput = ({
    onSend,
    onFileUpload,
    placeholder = 'Type a message...',
    onTyping,
}) => {
    const [message, setMessage] = useState('');
    const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
    const fileInputRef = useRef(null);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && onFileUpload) {
            onFileUpload(file);
        }
        e.target.value = null;
    };

    const handleEmojiClick = (emoji) => {
        setMessage((prev) => prev + emoji);
        setEmojiAnchorEl(null);
    };

    return (
        <Box sx={{ p: 2 }}>
            <form onSubmit={handleSend}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        component="label"
                        size="small"
                        color="primary"
                    >
                        <AttachFileIcon />
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*,.pdf,.doc,.docx,.txt"
                        />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => setEmojiAnchorEl(e.currentTarget)}
                    >
                        <EmojiIcon />
                    </IconButton>
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

            <Menu
                anchorEl={emojiAnchorEl}
                open={Boolean(emojiAnchorEl)}
                onClose={() => setEmojiAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', p: 1, maxWidth: 200 }}>
                    {EMOJI_LIST.map((emoji) => (
                        <Tooltip key={emoji} title={emoji}>
                            <IconButton
                                size="small"
                                onClick={() => handleEmojiClick(emoji)}
                            >
                                {emoji}
                            </IconButton>
                        </Tooltip>
                    ))}
                </Box>
            </Menu>
        </Box>
    );
};

export default MessageInput; 