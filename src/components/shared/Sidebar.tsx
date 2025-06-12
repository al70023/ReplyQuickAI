import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { Phone as PhoneIcon, Message as MessageIcon } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = () => {
  const navItems = [
    { text: 'Call Logs', icon: <PhoneIcon />, path: '/call-logs' },
    { text: 'SMS Inbox', icon: <MessageIcon />, path: '/sms-inbox' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                end={item.path === '/'}
                sx={{
                  '&.active': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    borderRight: '4px solid #1976d2',
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 