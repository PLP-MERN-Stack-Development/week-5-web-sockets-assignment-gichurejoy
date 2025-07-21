import { useState, useRef } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from '@mui/material';
import {
    AttachFile as AttachFileIcon,
    Close as CloseIcon,
    Image as ImageIcon,
    Description as FileIcon,
} from '@mui/icons-material';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = {
    'image/jpeg': true,
    'image/png': true,
    'image/gif': true,
    'application/pdf': true,
    'text/plain': true,
};

const FileUpload = ({ onFileSelect }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!ALLOWED_TYPES[file.type]) {
            setError('File type not supported');
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError('File size should be less than 5MB');
            return;
        }

        setError('');
        setSelectedFile(file);

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreview('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                await onFileSelect({
                    file: e.target.result,
                    fileName: selectedFile.name,
                    fileType: selectedFile.type,
                });
                handleClose();
            };
            reader.readAsDataURL(selectedFile);
        } catch (err) {
            setError('Failed to upload file');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setPreview('');
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <IconButton
                component="label"
                size="small"
                color="primary"
                disabled={uploading}
            >
                <AttachFileIcon />
                <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept={Object.keys(ALLOWED_TYPES).join(',')}
                />
            </IconButton>

            <Dialog
                open={!!selectedFile}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Upload File
                    <IconButton
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {error && (
                        <Typography color="error" gutterBottom>
                            {error}
                        </Typography>
                    )}
                    {selectedFile && (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            {preview ? (
                                <Box
                                    component="img"
                                    src={preview}
                                    alt="Preview"
                                    sx={{
                                        maxWidth: '100%',
                                        maxHeight: 300,
                                        objectFit: 'contain',
                                    }}
                                />
                            ) : (
                                <Box sx={{ p: 3, bgcolor: 'action.hover', borderRadius: 1 }}>
                                    {selectedFile.type.includes('pdf') ? (
                                        <FileIcon sx={{ fontSize: 48 }} />
                                    ) : (
                                        <FileIcon sx={{ fontSize: 48 }} />
                                    )}
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {selectedFile.name}
                                    </Typography>
                                </Box>
                            )}
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={uploading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        variant="contained"
                        disabled={!selectedFile || uploading}
                        startIcon={uploading && <CircularProgress size={20} />}
                    >
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default FileUpload; 