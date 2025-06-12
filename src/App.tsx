import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme';
import Layout from './components/shared/Layout';
import { CallLogsPage, SMSInboxPage, ContactProfilePage } from './pages';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/call-logs" replace />} />
            <Route path="/call-logs" element={<CallLogsPage />} />
            <Route path="/sms-inbox" element={<SMSInboxPage />} />
            <Route path="/sms-inbox/:contactId" element={<SMSInboxPage />} />
            <Route path="/profile/:contactId" element={<ContactProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App; 