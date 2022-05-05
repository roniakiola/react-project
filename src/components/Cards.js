import {IconButton, Button, Typography, Grid} from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PropTypes from 'prop-types';
import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {Link} from 'react-router-dom';
import {mediaUrl} from '../utils/variables';
import {safeParseJson} from '../utils/functions';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const InstrumentCard = ({file, userId, deleteMedia}) => {
  const {update, setUpdate} = useContext(MediaContext);
  const doDelete = () => {
    const ok = confirm('Delete post?');
    if (ok) {
      try {
        const deleteInfo = deleteMedia(
          file.file_id,
          localStorage.getItem('token')
        );
        if (deleteInfo) {
          setUpdate(!update);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  console.log(file);
  const {description} = safeParseJson(file.description) || {
    description: file.description,
  };

  return (
    <Grid item xs={10} md={4}>
      <Card key={file.file_id} style={{boxShadow: '5px 5px 12px 2px #0C5D8B'}}>
        <CardHeader title={file.title} subheader={file.username} />
        <CardMedia
          component="img"
          height="180"
          src={
            file.thumbnails ? mediaUrl + file.thumbnails.w320 : 'logo512.png'
          }
          alt={file.title}
        />
        <CardContent>
          <Typography>{description}</Typography>
        </CardContent>
        <CardActions
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <Button
            style={{backgroundColor: '#1394DF', color: 'white'}}
            variant="contained"
            component={Link}
            to={'/single'}
            state={{file}}
          >
            View
          </Button>
          {userId === file.user_id && (
            <>
              <Button
                variant="contained"
                component={Link}
                to={'/modify'}
                state={{file}}
              >
                <EditIcon />
              </Button>
              <IconButton
                aria-label="delete"
                variant="contained"
                onClick={doDelete}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
};

InstrumentCard.propTypes = {
  file: PropTypes.object,
  userId: PropTypes.number,
  deleteMedia: PropTypes.func,
};

export default InstrumentCard;
