import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { smsService } from '../../services';
import type { SMSThread, SmartReply } from '../../types';

interface MessageThreadPanelProps {
  contactId: string | null;
}

const MessageThreadPanel: React.FC<MessageThreadPanelProps> = ({ contactId }) => {
  const [thread, setThread] = useState<SMSThread | null | undefined>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [smartReplies, setSmartReplies] = useState<SmartReply[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!contactId) {
      setThread(null);
      setLoading(false);
      return;
    }

    const fetchThread = async () => {
      setLoading(true);
      try {
        const data = await smsService.getSmsThreadByContactId(contactId);
        setThread(data);

        const replies = await smsService.getSmartReplies();
        setSmartReplies(replies);
      } catch (error) {
        console.error('Error fetching SMS thread:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [contactId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [thread?.messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !contactId) return;

    try {
      const updatedThread = await smsService.sendMessage(contactId, message);
      setThread(updatedThread);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSmartReply = async (replyText: string) => {
    if (!contactId) return;

    try {
      const updatedThread = await smsService.sendMessage(contactId, replyText);
      setThread(updatedThread);
    } catch (error) {
      console.error('Error sending smart reply:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!thread) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h6" color="text.secondary">
          Select a conversation to start messaging.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        bgcolor: '#36393f',
      }}
    >
      {/* Header */}
      <Paper sx={{ p: 2, bgcolor: '#36393f', color: 'white', borderBottom: '1px solid #202225', boxShadow: 'none', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6">{thread.contactName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {thread.contactNumber}
          </Typography>
        </Box>
        <Button variant="outlined" size="small" onClick={() => navigate(`/profile/${contactId}`)} sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.5)' }}>
          View Profile
        </Button>
      </Paper>

      {/* Banners */}
      {thread.twilioNumber && (
        <Box sx={{ p: 1, mx: 2, textAlign: 'center', color: 'text.secondary', fontSize: '0.8rem' }}>
            Texting with Twilio number: {thread.twilioNumber}
        </Box>
      )}

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {thread.messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              alignSelf: msg.direction === 'outbound' ? 'flex-end' : 'flex-start',
              maxWidth: '70%',
              mb: 1,
            }}
          >
            <Paper
              sx={{
                p: 1.5,
                bgcolor: msg.direction === 'outbound' ? 'primary.main' : '#40444b',
                color: 'white',
                borderRadius: '12px',
                boxShadow: 'none',
              }}
            >
              <Typography variant="body1">{msg.body}</Typography>
            </Paper>
            <Typography variant="caption" sx={{ display: 'block', textAlign: msg.direction === 'outbound' ? 'right' : 'left', px: 1, color: 'text.secondary' }}>
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Smart Replies */}
      {smartReplies.length > 0 && (
        <Box sx={{ p: 1, px: 2, display: 'flex', flexWrap: 'wrap', gap: 1, flexShrink: 0, borderTop: '1px solid #40444b' }}>
          {smartReplies.map((reply) => (
            <Chip
              key={reply.id}
              label={reply.text}
              onClick={() => handleSmartReply(reply.text)}
              clickable
              sx={{ bgcolor: '#40444b', color: 'white', '&:hover': { bgcolor: '#5c6066' } }}
            />
          ))}
        </Box>
      )}

      {/* Message Input */}
      <Box sx={{ p: 2, bgcolor: '#36393f', display: 'flex', flexShrink: 0 }}>
        <TextField
          fullWidth
          placeholder={`Message ${thread.contactName}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          variant="outlined"
          size="small"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          sx={{
            bgcolor: '#40444b',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none',
              },
            },
            '& .MuiInputBase-input': {
              color: 'white',
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'text.secondary',
              opacity: 1,
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 1 }}
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default MessageThreadPanel; 