import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { styled, createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckIcon from '@mui/icons-material/Check';
import PeopleIcon from '@mui/icons-material/People';
import UploadIcon from '@mui/icons-material/Upload';
import useMediaQuery from '@mui/material/useMediaQuery';

// Import your components
import AdminDashboard from "./components/Dashboard";
import ApproveItems from "./components/ManageItems";
import GiveToStudent from "./components/GiveToStudent";
import UploadItem from "./components/UploadItem";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const menuItems = [
  { text: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
  { text: 'Approve Items', path: '/admin/approve', icon: <CheckIcon /> },
  { text: 'Give to Student', path: '/admin/give', icon: <PeopleIcon /> },
  { text: 'Upload Item', path: '/admin/upload', icon: <UploadIcon /> },
];

function AppContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(!isMobile);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        <AppBar position="absolute" open={open}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer 
          variant={isMobile ? 'temporary' : 'permanent'} 
          open={open} 
          onClose={handleDrawerToggle}
        >
          <Toolbar>
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <List>
            {menuItems.map((item) => (
              <ListItem 
                key={item.text}
                component={Link}
                to={item.path}
                onClick={isMobile ? handleDrawerToggle : undefined}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.action.selected,
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
                }}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3,
            width: `calc(100% - ${open ? drawerWidth : 0}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/approve" element={<ApproveItems />} />
              <Route path="/admin/give" element={<GiveToStudent />} />
              <Route path="/admin/upload" element={<UploadItem />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;