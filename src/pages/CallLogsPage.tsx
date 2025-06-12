import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import CallLogsTable from '../components/CallLogs/CallLogsTable';
import CallDetailModal from '../components/CallLogs/CallDetailModal';
import type { CallLog } from '../types';
import { callService } from '../services';

const CallLogsPage: React.FC = () => {
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCalls = async () => {
      setLoading(true);
      const data = await callService.getCallLogs();
      setCalls(data);
      setLoading(false);
    };
    fetchCalls();
  }, []);

  const handleRowClick = (call: CallLog) => {
    setSelectedCall(call);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCall(null);
  };

  const handleQualificationChange = (callId: string, isQualified: boolean) => {
    // Update the list of all calls
    setCalls((prevCalls) =>
      prevCalls.map((c) => (c.id === callId ? { ...c, isQualified } : c))
    );

    // Also update the selected call if it's the one being changed
    if (selectedCall && selectedCall.id === callId) {
      setSelectedCall({ ...selectedCall, isQualified });
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Call Logs
      </Typography>
      <CallLogsTable calls={calls} loading={loading} onRowClick={handleRowClick} />
      <CallDetailModal
        call={selectedCall}
        open={isModalOpen}
        onClose={handleModalClose}
        onQualificationChange={handleQualificationChange}
      />
    </Box>
  );
};

export default CallLogsPage; 