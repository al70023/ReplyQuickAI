import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
  Typography,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import ContactListPanel from '../components/SMSInbox/ContactListPanel';
import MessageThreadPanel from '../components/SMSInbox/MessageThreadPanel';
import { smsService } from '../services';

const SMSInboxPage = () => {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    contactId || null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (contactId && contactId !== selectedContactId) {
      setSelectedContactId(contactId);
    }

    if (!contactId) {
      const fetchFirstThread = async () => {
        try {
          const threads = await smsService.getSmsThreads();
          if (threads.length > 0) {
            const firstContactId = threads[0].contactId;
            navigate(`/sms-inbox/${firstContactId}`, { replace: true });
          }
        } catch (error) {
          console.error('Error fetching threads:', error);
        }
      };
      fetchFirstThread();
    }
  }, [contactId, navigate, selectedContactId]);

  const handleContactSelect = (newContactId: string) => {
    setSelectedContactId(newContactId);
    navigate(`/sms-inbox/${newContactId}`);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const contactList = (
    <ContactListPanel
      selectedContactId={selectedContactId}
      onContactSelect={handleContactSelect}
    />
  );

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h5">
            SMS Inbox
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {isMobile ? (
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <Box sx={{ width: '320px', height: '100%' }}>
              {contactList}
            </Box>
          </Drawer>
        ) : (
          <Paper
            elevation={2}
            sx={{ width: '320px', height: '100%', flexShrink: 0, display: 'flex' }}
          >
            {contactList}
          </Paper>
        )}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <MessageThreadPanel contactId={selectedContactId} />
        </Box>
      </Box>
    </Box>
  );
};

export default SMSInboxPage; 