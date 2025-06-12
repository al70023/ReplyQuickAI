import React from 'react';
import { Typography, Box } from '@mui/material';

const SMSInbox: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        SMS Inbox
      </Typography>
      <Typography>
        This is where the SMS inbox will be displayed.
      </Typography>
    </Box>
  );
};

export default SMSInbox; 