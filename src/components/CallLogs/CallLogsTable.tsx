import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import type { CallLog } from '../../types';

interface CallLogsTableProps {
  calls: CallLog[];
  loading: boolean;
  onRowClick: (call: CallLog) => void;
}

type Order = 'asc' | 'desc';

const CallLogsTable: React.FC<CallLogsTableProps> = ({
  calls,
  loading,
  onRowClick,
}) => {
  const [filter, setFilter] = useState('');
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof CallLog>('timestamp');

  const handleRequestSort = (property: keyof CallLog) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredCalls = calls.filter(
    (call) =>
      call.callerNumber.includes(filter) ||
      call.dialedNumber.includes(filter) ||
      call.summary.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedCalls = [...filteredCalls].sort((a, b) => {
    const isAsc = order === 'asc';
    if (orderBy === 'timestamp') {
      return isAsc
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    if (a[orderBy] < b[orderBy]) {
      return isAsc ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return isAsc ? 1 : -1;
    }
    return 0;
  });

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Call Logs...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          label="Filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by number or summary..."
          variant="outlined"
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sortDirection={orderBy === 'callerNumber' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'callerNumber'}
                  direction={orderBy === 'callerNumber' ? order : 'asc'}
                  onClick={() => handleRequestSort('callerNumber')}
                >
                  Caller
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'dialedNumber' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'dialedNumber'}
                  direction={orderBy === 'dialedNumber' ? order : 'asc'}
                  onClick={() => handleRequestSort('dialedNumber')}
                >
                  Dialed
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'timestamp' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'timestamp'}
                  direction={orderBy === 'timestamp' ? order : 'asc'}
                  onClick={() => handleRequestSort('timestamp')}
                >
                  Date/Time
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'duration' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'duration'}
                  direction={orderBy === 'duration' ? order : 'asc'}
                  onClick={() => handleRequestSort('duration')}
                >
                  Duration
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'isQualified' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'isQualified'}
                  direction={orderBy === 'isQualified' ? order : 'asc'}
                  onClick={() => handleRequestSort('isQualified')}
                >
                  Qualified
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCalls.map((call) => (
              <TableRow
                key={call.id}
                onClick={() => onRowClick(call)}
                hover
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{call.callerNumber}</TableCell>
                <TableCell>{call.dialedNumber}</TableCell>
                <TableCell>{new Date(call.timestamp).toLocaleString()}</TableCell>
                <TableCell>{call.duration}</TableCell>
                <TableCell>{call.isQualified ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CallLogsTable; 