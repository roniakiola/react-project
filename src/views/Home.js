import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {Link} from 'react-router-dom';
import Container from '@mui/material/Container';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
const Home = () => {
  return (
    <>
      <Typography component="h1" variant="h2">
        Categories
      </Typography>
      <Container maxWidth="sm">
        <Box sx={{bgcolor: '#cfe8fc'}}>
          <List>
            <ListItemButton component={Link} to="/guitars">
              <ListItemIcon>
                <MusicNoteIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Guitars" />
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
            </ListItemButton>
            <ListItemButton component={Link} to="/bass">
              <ListItemIcon>
                <MusicNoteIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Bass Guitars" />
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
            </ListItemButton>
            <ListItemButton component={Link} to="/drums">
              <ListItemIcon>
                <MusicNoteIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Drums" />
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
            </ListItemButton>
          </List>
        </Box>
      </Container>
    </>
  );
};

export default Home;
