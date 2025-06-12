import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { Phone as PhoneIcon, Chat as ChatIcon } from '@mui/icons-material';
import { callService, smsService } from '../services';
import { CallLog, SMSMessage } from '../types';

interface Interaction {
  type: 'call' | 'message';
  timestamp: string;
  data: CallLog | SMSMessage;
}

// Helper function to merge and sort calls and messages by timestamp
const mergeInteractions = (calls: CallLog[], messages: SMSMessage[]): Interaction[] => {
  const callItems: Interaction[] = calls.map(call => ({
    type: 'call',
    timestamp: call.timestamp,
    data: call,
  }));

  const messageItems: Interaction[] = messages.map(msg => ({
    type: 'message',
    timestamp: msg.timestamp,
    data: msg,
  }));

  return [...callItems, ...messageItems].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

const ContactProfilePage = () => {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState<any>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!contactId) return;

    const fetchContactData = async () => {
      setLoading(true);
      try {
        const thread = await smsService.getSmsThreadByContactId(contactId);

        if (!thread) {
          console.error('Contact not found');
          setLoading(false);
          return;
        }

        setContactData({
          id: contactId,
          name: thread.contactName,
          number: thread.contactNumber,
          email: `${thread.contactName.toLowerCase().replace(/\s/g, '.')}@example.com`,
          tags: ['Prospect', 'Follow-up'],
        });

        const allCalls = await callService.getCallLogs();
        const contactCalls = allCalls.filter(
          call =>
            call.callerNumber === thread.contactNumber ||
            call.dialedNumber === thread.contactNumber
        );

        const messages = thread.messages;
        const mergedInteractions = mergeInteractions(contactCalls, messages);
        setInteractions(mergedInteractions);
      } catch (error) {
        console.error('Error fetching contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, [contactId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleViewCall = (callId: string) => {
    navigate(`/call-logs?callId=${callId}`);
  };

  const handleViewChat = () => {
    if(contactId) navigate(`/sms-inbox/${contactId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading contact profile...</Typography>
      </Box>
    );
  }

  if (!contactData) {
     return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography>Contact not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
        >
          <Box>
            <Typography variant="h4">{contactData.name}</Typography>
            <Typography variant="body1" color="text.secondary">
              {contactData.number}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {contactData.email}
            </Typography>
            <Box sx={{ mt: 1 }}>
              {contactData.tags.map((tag: string, index: number) => (
                <Chip key={index} label={tag} size="small" sx={{ mr: 1 }} />
              ))}
            </Box>
          </Box>
          <Box>
            <Button
              variant="contained"
              startIcon={<ChatIcon />}
              onClick={handleViewChat}
              sx={{ mr: 1 }}
            >
              View Chat
            </Button>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p:3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="All Interactions" />
          <Tab label="Calls" />
          <Tab label="Messages" />
        </Tabs>
        
        <Timeline position="right">
          {interactions
            .filter(item => {
              if (activeTab === 0) return true;
              if (activeTab === 1) return item.type === 'call';
              if (activeTab === 2) return item.type === 'message';
              return false;
            })
            .map((item, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.2, textAlign: 'left' }}>
                  {new Date(item.timestamp).toLocaleString()}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={item.type === 'call' ? 'primary' : 'secondary'}>
                    {item.type === 'call' ? <PhoneIcon /> : <ChatIcon />}
                  </TimelineDot>
                  {index < interactions.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Paper sx={{ p: 2 }}>
                    {item.type === 'call' ? (
                      <>
                        <Typography variant="subtitle1">
                          {(item.data as CallLog).callerNumber === contactData.number
                            ? 'Inbound Call'
                            : 'Outbound Call'}
                        </Typography>
                        <Typography variant="body2">
                          Duration: {(item.data as CallLog).duration}
                        </Typography>
                        {(item.data as CallLog).summary && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {(item.data as CallLog).summary}
                          </Typography>
                        )}
                        <Button
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() => handleViewCall((item.data as CallLog).id)}
                        >
                          View Details
                        </Button>
                      </>
                    ) : (
                      <>
                        <Typography variant="subtitle1">
                          {(item.data as SMSMessage).direction === 'inbound'
                            ? 'Received Message'
                            : 'Sent Message'}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {(item.data as SMSMessage).body}
                        </Typography>
                      </>
                    )}
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
        </Timeline>
      </Paper>
    </Box>
  );
};

export default ContactProfilePage; 