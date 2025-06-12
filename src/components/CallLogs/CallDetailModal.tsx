import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Paper,
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import type { CallLog } from '../../types';
import { callService } from '../../services';

interface CallDetailModalProps {
  call: CallLog | null;
  open: boolean;
  onClose: () => void;
  onQualificationChange: (callId: string, isQualified: boolean) => void;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
  borderRadius: 2,
};

const CallDetailModal: React.FC<CallDetailModalProps> = ({
  call,
  open,
  onClose,
  onQualificationChange,
}) => {
  const [isQualified, setIsQualified] = useState(false);

  useEffect(() => {
    if (call) {
      setIsQualified(call.isQualified);
    }
  }, [call]);

  if (!call) return null;

  const handleQualificationToggle = async () => {
    const newValue = !isQualified;
    setIsQualified(newValue); // Optimistic UI update
    try {
      await callService.updateQualificationStatus(call.id, newValue);
      onQualificationChange(call.id, newValue);
    } catch (error) {
      console.error('Failed to update qualification status:', error);
      setIsQualified(!newValue); // Revert on error
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2">
            Call Details
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* General Call Info */}
        <Box sx={{ mt: 2, mb: 3 }}>
          <Typography variant="subtitle1">
            <strong>From:</strong> {call.callerNumber}
          </Typography>
          <Typography variant="subtitle1">
            <strong>To:</strong> {call.dialedNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(call.timestamp).toLocaleString()}
          </Typography>
        </Box>

        {/* Placeholder Audio Player */}
        <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Call Recording
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 1,
            }}
          >
            <Button
              variant="contained"
              size="small"
              startIcon={<PlayArrowIcon />}
              disabled
            >
              Play
            </Button>
            <Box
              sx={{
                flex: 1,
                height: 4,
                mx: 2,
                backgroundColor: 'action.disabled',
                borderRadius: 1,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              00:00 / {call.duration}
            </Typography>
          </Box>
        </Paper>

        {/* Transcript */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Transcript
          </Typography>
          <Paper
            variant="outlined"
            sx={{ p: 2, mt: 1, maxHeight: 200, overflow: 'auto' }}
          >
            {call.transcript.map((line, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                {line}
              </Typography>
            ))}
          </Paper>
        </Box>

        {/* Summary */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            AI Summary
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
            <Typography variant="body2">{call.summary}</Typography>
          </Paper>
        </Box>

        {/* Actions */}
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={isQualified}
                onChange={handleQualificationToggle}
              />
            }
            label="Qualified Lead"
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default CallDetailModal; 