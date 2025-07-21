import { useRef, useEffect, useCallback, memo } from 'react';
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
import { Virtuoso } from 'react-virtuoso';
import { EmojiEmotions as EmojiIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const MessageItem = memo(({ message, username, onReactionClick }) => (
    <ListItem
        sx={{
            flexDirection: 'column',
            alignItems: message.user === username ? 'flex-end' : 'flex-start',
            py: 0.5,
        }}
    >
        <Typography variant="caption" color="text.secondary">
            {message.user || message.senderName} • {format(new Date(message.timestamp), 'HH:mm')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, maxWidth: '70%' }}>
            <Paper
                sx={{
                    p: 1.5,
                    bgcolor: message.user === username ? 'primary.main' : 'background.paper',
                    color: message.user === username ? 'primary.contrastText' : 'text.primary',
                }}
            >
                {message.type === 'file' ? (
                    <Box>
                        <Typography variant="body2">{message.text}</Typography>
                        {message.fileType?.startsWith('image/') ? (
                            <Box
                                component="img"
                                src={message.file}
                                alt={message.fileName}
                                sx={{
                                    maxWidth: '100%',
                                    maxHeight: 200,
                                    mt: 1,
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                }}
                                loading="lazy"
                            />
                        ) : (
                            <Button
                                variant="outlined"
                                size="small"
                                href={message.file}
                                download={message.fileName}
                                sx={{ mt: 1 }}
                            >
                                Download {message.fileName}
                            </Button>
                        )}
                    </Box>
                ) : (
                    <Typography variant="body1">{message.text}</Typography>
                )}
            </Paper>
            <IconButton
                size="small"
                onClick={(e) => onReactionClick(message, e)}
            >
                <EmojiIcon fontSize="small" />
            </IconButton>
        </Box>
        {message.reactions && Object.entries(message.reactions).length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                {Object.entries(message.reactions).map(([reaction, users]) => (
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
));

const MessageList = ({
    messages,
    username,
    onReactionClick,
    onLoadMore,
    hasMore,
    typingUsers,
}) => {
    const virtuosoRef = useRef(null);

    useEffect(() => {
        virtuosoRef.current?.scrollToIndex({
            index: messages.length - 1,
            behavior: 'smooth',
        });
    }, [messages.length]);

    const handleEndReached = useCallback(() => {
        if (hasMore) {
            onLoadMore();
        }
    }, [hasMore, onLoadMore]);

    return (
        <Box
            sx={{
                flex: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Virtuoso
                ref={virtuosoRef}
                style={{ flex: 1 }}
                data={messages}
                endReached={handleEndReached}
                overscan={200}
                itemContent={(index, message) => (
                    <MessageItem
                        message={message}
                        username={username}
                        onReactionClick={onReactionClick}
                    />
                )}
                components={{
                    Header: hasMore ? () => (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Button onClick={onLoadMore}>
                                Load More Messages
                            </Button>
                        </Box>
                    ) : null,
                    Footer: () => (
                        typingUsers.length > 0 ? (
                            <Typography variant="caption" color="text.secondary" sx={{ pl: 2, pb: 1 }}>
                                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                            </Typography>
                        ) : null
                    ),
                }}
            />
        </Box>
    );
};

export default memo(MessageList); 