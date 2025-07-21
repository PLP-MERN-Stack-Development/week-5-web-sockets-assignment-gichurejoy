import { useState, useEffect } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Login from './components/Login';
import Chat from './components/Chat';
import { SocketProvider } from './context/SocketContext';

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    const [username, setUsername] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = (name) => {
        setUsername(name);
        setIsAuthenticated(true);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                    {!isAuthenticated ? (
                        <Login onLogin={handleLogin} />
                    ) : (
                        <SocketProvider username={username}>
                            <Chat username={username} />
                        </SocketProvider>
                    )}
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default App; 