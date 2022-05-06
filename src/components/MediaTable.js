import PropTypes from 'prop-types';
import {Grid} from '@mui/material';
// import {CircularProgress, ImageList} from '@mui/material';
import {useMedia} from '../hooks/ApiHooks';
// import {useWindowSize} from '../hooks/WindowHooks';
// import MediaRow from './MediaRow';
import InstrumentCard from './Cards';
import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import FormDialog from './ModalForm';

const MediaTable = ({category}) => {
  const {user} = useContext(MediaContext);
  const {mediaArray, deleteMedia} = useMedia(user?.user_id, category);
  // const windowSize = useWindowSize();
  console.log(mediaArray);
  return (
    <>
      <FormDialog />
      <Grid container spacing={6} justifyContent="center" paddingTop={'20px'}>
        {mediaArray.map((item, index) => {
          return (
            <InstrumentCard
              key={index}
              file={item}
              userId={user?.user_id}
              deleteMedia={deleteMedia}
            />
          );
        })}
      </Grid>
    </>
  );
};

MediaTable.propTypes = {
  category: PropTypes.string,
};

export default MediaTable;
