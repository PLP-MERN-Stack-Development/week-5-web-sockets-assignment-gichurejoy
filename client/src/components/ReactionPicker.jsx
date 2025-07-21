import { useState } from 'react';
import {
    Box,
    IconButton,
    Popover,
    TextField,
    Typography,
    Tab,
    Tabs,
} from '@mui/material';
import { EmojiEmotions as EmojiIcon } from '@mui/icons-material';

const REACTION_CATEGORIES = {
    'Frequently Used': ['👍', '❤️', '😄', '😮', '😢', '😡', '👋', '🎉'],
    'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌'],
    'Gestures': ['👍', '👎', '👊', '✊', '🤛', '🤜', '🤚', '✋', '🖐️', '👋', '🤙', '👌'],
    'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔', '❣️', '💕'],
    'Symbols': ['✨', '💫', '💥', '💢', '💦', '💨', '🕳️', '💣', '💬', '💭', '🗯️', '💯'],
};

const ReactionPicker = ({ onSelect }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Frequently Used');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSearchQuery('');
    };

    const handleSelect = (reaction) => {
        onSelect(reaction);
        handleClose();
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setSelectedCategory(null);
    };

    const handleCategoryChange = (event, newValue) => {
        setSelectedCategory(newValue);
        setSearchQuery('');
    };

    const filteredReactions = searchQuery
        ? Object.values(REACTION_CATEGORIES)
            .flat()
            .filter(reaction => reaction.includes(searchQuery))
        : REACTION_CATEGORIES[selectedCategory] || [];

    return (
        <>
            <IconButton size="small" onClick={handleClick}>
                <EmojiIcon fontSize="small" />
            </IconButton>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Box sx={{ width: 320, maxHeight: 400 }}>
                    <Box sx={{ p: 1 }}>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Search reactions..."
                            value={searchQuery}
                            onChange={handleSearch}
                            variant="outlined"
                        />
                    </Box>

                    {!searchQuery && (
                        <Tabs
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            {Object.keys(REACTION_CATEGORIES).map((category) => (
                                <Tab
                                    key={category}
                                    label={category}
                                    value={category}
                                    sx={{ minWidth: 'auto' }}
                                />
                            ))}
                        </Tabs>
                    )}

                    <Box
                        sx={{
                            p: 1,
                            height: 250,
                            overflow: 'auto',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(8, 1fr)',
                            gap: 0.5,
                        }}
                    >
                        {filteredReactions.map((reaction) => (
                            <IconButton
                                key={reaction}
                                size="small"
                                onClick={() => handleSelect(reaction)}
                                sx={{
                                    width: 32,
                                    height: 32,
                                    fontSize: '1.25rem',
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    },
                                }}
                            >
                                {reaction}
                            </IconButton>
                        ))}
                        {filteredReactions.length === 0 && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 2 }}
                            >
                                No reactions found
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Popover>
        </>
    );
};

export default ReactionPicker; 