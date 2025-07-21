import { Box, Typography, Badge } from '@mui/material';
import { useSocket } from '../context/SocketContext';

const UserList = ({ onUserSelect, selectedUser }) => {
    const { users } = useSocket();

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Online Users ({users.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Typography
                    variant="body2"
                    sx={{
                        bgcolor: !selectedUser ? 'primary.main' : 'action.hover',
                        color: !selectedUser ? 'primary.contrastText' : 'text.primary',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        cursor: 'pointer',
                        '&:hover': {
                            bgcolor: !selectedUser ? 'primary.dark' : 'action.selected',
                        },
                    }}
                    onClick={() => onUserSelect(null)}
                >
                    Global Chat
                </Typography>
                {users.map((user) => (
                    <Badge
                        key={user.id}
                        color="success"
                        variant="dot"
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                bgcolor: selectedUser?.id === user.id ? 'primary.main' : 'action.hover',
                                color: selectedUser?.id === user.id ? 'primary.contrastText' : 'text.primary',
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                cursor: 'pointer',
                                '&:hover': {
                                    bgcolor: selectedUser?.id === user.id ? 'primary.dark' : 'action.selected',
                                },
                            }}
                            onClick={() => onUserSelect(user)}
                        >
                            {user.username}
                        </Typography>
                    </Badge>
                ))}
            </Box>
        </Box>
    );
};

export default UserList; 