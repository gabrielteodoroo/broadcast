import { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HubIcon from '@mui/icons-material/Hub';
import LogoutIcon from '@mui/icons-material/Logout';
import CampaignIcon from '@mui/icons-material/Campaign';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/auth-context';
import { logout } from '../features/auth/auth-service';

const DRAWER_WIDTH = 264;

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const connectionsActive =
    location.pathname === '/' || location.pathname.startsWith('/connections');

  const go = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const initials = (user?.displayName || user?.email || '?')
    .charAt(0)
    .toUpperCase();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <CampaignIcon fontSize="small" />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Broadcast
        </Typography>
      </Box>
      <Divider />

      <Box sx={{ flexGrow: 1, px: 1.5, py: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontWeight: 600, px: 1 }}
        >
          MENU PRINCIPAL
        </Typography>
        <List sx={{ mt: 1 }}>
          <ListItemButton
            selected={connectionsActive}
            onClick={() => go('/')}
            sx={{
              borderRadius: 2,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': { bgcolor: 'primary.dark' },
                '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <HubIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Conexões"
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItemButton>
        </List>
      </Box>

      <Divider />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.light', width: 36, height: 36 }}>
          {initials}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
            {user?.displayName || 'Cliente'}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap component="div">
            {user?.email}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleLogout} aria-label="Sair">
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderColor: 'divider',
            },
          }}
        >
          <SidebarContent />
        </Drawer>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          height: '100%',
        }}
      >
        <AppBar
          position="sticky"
          sx={{
            display: { md: 'none' },
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Toolbar variant="dense">
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>
              Broadcast
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default' }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 960,
              mx: 'auto',
              p: { xs: 2, sm: 3 },
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
