import {
  AppBar,
  Box,
  Button,
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
import {useContext, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {MediaContext} from '../contexts/MediaContext';
import {useUser} from '../hooks/ApiHooks';
import {Home, AccountCircle, Close} from '@mui/icons-material';
import {Stack} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import BackButton from './BackButton';

const Nav = () => {
  const {user, setUser} = useContext(MediaContext);
  const [open, setOpen] = useState(false);
  const {getUser} = useUser();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const userData = await getUser(localStorage.getItem('token'));
      console.log(userData);
      setUser(userData);
    } catch (err) {
      setUser(null);
      navigate('/');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  console.log(user, open);

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar disableGutters>
          <IconButton>
            <BackButton />
          </IconButton>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            Soittimet.net
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to={user ? '/logout' : '/'}
            style={{
              backgroundColor: '#1394DF',
              color: 'white',
              marginRight: '4%',
            }}
          >
            {user ? 'Logout' : 'Login'}
          </Button>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{mr: 2}}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <MenuIcon sx={{fontSize: '120%'}} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        PaperProps={{
          sx: {width: '90%'},
        }}
        open={open}
        onClose={() => {
          setOpen(!open);
        }}
      >
        <List
          onClick={() => {
            setOpen(!open);
          }}
        >
          <ListItemButton
            style={{
              width: '3.5%',
            }}
          >
            <ListItemIcon>
              <Close fontSize="large" />
            </ListItemIcon>
          </ListItemButton>
          <Stack spacing={2} paddingTop="20px">
            <ListItemButton component={Link} to={'/home'}>
              <ListItemIcon>
                <Home fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
            {user && (
              <>
                <ListItemButton component={Link} to="/profile">
                  <ListItemIcon>
                    <AccountCircle fontSize="large" />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </>
            )}
            <ListItemText
              primary="Categories"
              disableTypography
              style={{
                fontSize: '200%',
                paddingTop: '25px',
                paddingBottom: '15px',
                paddingLeft: '25px',
                width: '50%',
              }}
            />
            <ListItemButton component={Link} to="/guitars">
              <ListItemIcon>
                <MusicNoteIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Guitars" />
            </ListItemButton>
            <ListItemButton component={Link} to="/bass">
              <ListItemIcon>
                <MusicNoteIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Bass Guitars" />
            </ListItemButton>
            <ListItemButton component={Link} to="/drums">
              <ListItemIcon>
                <MusicNoteIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Drums" />
            </ListItemButton>
          </Stack>
        </List>
      </Drawer>
    </Box>
  );
};

export default Nav;
