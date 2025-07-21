import { useRef, useEffect } from 'react';
import {
    Box,
    List,
    ListItem,
    Typography,
    Paper,
    IconButton,
    Badge,
    Tooltip,
    Button,
} from '@mui/material';
import { EmojiEmotions as EmojiIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const REACTIONS = ['👍', '❤️', '😄', '😮', '😢', '😡'];

const MessageList = ({
    messages,
    username,
    onReactionClick,
    onLoadMore,
    hasMore,
    typingUsers,
}) => {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleScroll = (e) => {
        const container = e.target;
        if (container.scrollTop === 0 && hasMore) {
            onLoadMore();
        }
    };

    return (
        <Box
            ref={containerRef}
            onScroll={handleScroll}
            sx={{
                flex: 1,
                overflow: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {hasMore && (
                <Button onClick={onLoadMore} sx={{ alignSelf: 'center', mb: 2 }}>
                    Load More Messages
                </Button>
            )}
            <List>
                {messages.map((msg, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            flexDirection: 'column',
                            alignItems: msg.user === username ? 'flex-end' : 'flex-start',
                            py: 0.5,
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            {msg.user || msg.senderName} • {format(new Date(msg.timestamp), 'HH:mm')}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, maxWidth: '70%' }}>
                            <Paper
                                sx={{
                                    p: 1.5,
                                    bgcolor: msg.user === username ? 'primary.main' : 'background.paper',
                                    color: msg.user === username ? 'primary.contrastText' : 'text.primary',
                                }}
                            >
                                {msg.type === 'file' ? (
                                    <Box>
                                        <Typography variant="body2">{msg.text}</Typography>
                                        {msg.fileType?.startsWith('image/') ? (
                                            <Box
                                                component="img"
                                                src={msg.file}
                                                alt={msg.fileName}
                                                sx={{
                                                    maxWidth: '100%',
                                                    maxHeight: 200,
                                                    mt: 1,
                                                    borderRadius: 1,
                                                }}
                                            />
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                href={msg.file}
                                                download={msg.fileName}
                                                sx={{ mt: 1 }}
                                            >
                                                Download {msg.fileName}
                                            </Button>
                                        )}
                                    </Box>
                                ) : (
                                    <Typography variant="body1">{msg.text}</Typography>
                                )}
                            </Paper>
                            <IconButton
                                size="small"
                                onClick={(e) => onReactionClick(msg, e)}
                            >
                                <EmojiIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        {msg.reactions && Object.entries(msg.reactions).length > 0 && (
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                {Object.entries(msg.reactions).map(([reaction, users]) => (
                                    <Tooltip
                                        key={reaction}
                                        title={users.join(', ')}
                                        arrow
                                    >
                                        <Badge
                                            badgeContent={users.length}
                                            color="primary"
                                            sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    bgcolor: 'action.hover',
                                                    px: 0.5,
                                                    borderRadius: 1,
                                                    cursor: 'default'
                                                }}
                                            >
                                                {reaction}
                                            </Typography>
                                        </Badge>
                                    </Tooltip>
                                ))}
                            </Box>
                        )}
                    </ListItem>
                ))}
                <div ref={messagesEndRef} />
            </List>
            {typingUsers.length > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ pl: 2, pb: 1 }}>
                    {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </Typography>
            )}
        </Box>
    );
};

export default MessageList; 