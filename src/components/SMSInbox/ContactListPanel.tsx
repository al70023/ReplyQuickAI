// src/components/SMSInbox/ContactListPanel.tsx
import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  TextField,
  CircularProgress,
} from '@mui/material';
import { smsService } from '../../services';
import type { SMSThread } from '../../types';

interface ContactListPanelProps {
  onContactSelect: (contactId: string) => void;
  selectedContactId: string | null;
}

const ContactListPanel: React.FC<ContactListPanelProps> = ({
  onContactSelect,
  selectedContactId,
}) => {
  const [threads, setThreads] = useState<SMSThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const data = await smsService.getSmsThreads();
        setThreads(data);
      } catch (error) {
        console.error('Error fetching SMS threads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  const filteredThreads = threads.filter(
    (thread) =>
      thread.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.contactNumber.includes(searchTerm)
  );

  // Sort threads by timestamp (most recent first)
  const sortedThreads = [...filteredThreads].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #e0e0e0',
      }}
    >
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search contacts"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
        />
      </Box>

      {loading ? (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <List sx={{ overflow: 'auto', flex: 1, p: 0 }}>
          {sortedThreads.map((thread) => (
            <ListItem
              key={thread.contactId}
              disablePadding
              sx={{
                borderLeft:
                  selectedContactId === thread.contactId
                    ? '4px solid #1976d2'
                    : 'none',
                bgcolor:
                  selectedContactId === thread.contactId
                    ? 'rgba(25, 118, 210, 0.08)'
                    : 'transparent',
              }}
            >
              <ListItemButton
                onClick={() => onContactSelect(thread.contactId)}
                selected={selectedContactId === thread.contactId}
                 sx={{
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                    },
                 }}
              >
                <ListItemAvatar>
                  <Avatar>{thread.contactName.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="subtitle2" noWrap>
                        {thread.contactName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(thread.timestamp).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" noWrap color="text.secondary">
                        {thread.lastMessage}
                      </Typography>
                      {thread.unreadCount > 0 && (
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block',
                            bgcolor: 'primary.main',
                            color: 'white',
                            borderRadius: '50%',
                            width: 20,
                            height: 20,
                            textAlign: 'center',
                            lineHeight: '20px',
                            fontSize: '0.75rem',
                            ml: 1,
                            float: 'right',
                          }}
                        >
                          {thread.unreadCount}
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ContactListPanel; 