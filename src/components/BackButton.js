import {ArrowBack} from '@mui/icons-material';
import {Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      style={{color: 'black'}}
      onClick={() => {
        navigate(-1);
      }}
    >
      <ArrowBack sx={{fontSize: '220%'}} />
    </Button>
  );
};

export default BackButton;
