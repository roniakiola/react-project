import {
  Button,
  CircularProgress,
  Grid,
  Typography,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {useNavigate} from 'react-router-dom';
import useForm from '../hooks/FormHooks';
import {useState, useEffect} from 'react';
// import {appID} from '../utils/variables';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import BackButton from '../components/BackButton';

const Upload = () => {
  const [preview, setPreview] = useState('logo192.png');
  const alkuarvot = {
    title: '',
    description: '',
    file: null,
  };

  const validators = {
    title: ['required', 'minStringLength: 3'],
    description: ['minStringLength: 5'],
  };

  const errorMessages = {
    username: ['required field', 'minimum 3 characters'],
    description: ['minimum 5 characters'],
  };

  const {postMedia, loading} = useMedia();
  const {postTag} = useTag();
  const navigate = useNavigate();

  const doUpload = async () => {
    try {
      console.log('doUpload');
      const desc = {
        description: inputs.description,
      };
      const token = localStorage.getItem('token');
      const formdata = new FormData();
      formdata.append('title', inputs.title);
      formdata.append('description', JSON.stringify(desc));
      formdata.append('file', inputs.file);
      formdata.append('category', inputs.category);
      const categoryTag = inputs.category;
      console.log(categoryTag);
      formdata.delete('category', inputs.category);
      const mediaData = await postMedia(formdata, token);
      const tagData = await postTag(
        {
          file_id: mediaData.file_id,
          tag: categoryTag,
        },
        token
      );
      confirm(tagData.message) && navigate('/home');
    } catch (err) {
      alert(err.message);
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(
    doUpload,
    alkuarvot
  );

  useEffect(() => {
    if (inputs.file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setPreview(reader.result);
      });
      reader.readAsDataURL(inputs.file);
    }
  }, [inputs.file]);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <BackButton />
          <Typography component="h1" variant="h2" gutterBottom>
            Upload
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <ValidatorForm onSubmit={handleSubmit}>
            <TextValidator
              fullWidth
              placeholder="title"
              name="title"
              onChange={handleInputChange}
              value={inputs.title}
              validators={validators.title}
              errorMessages={errorMessages.title}
            />
            <TextValidator
              fullWidth
              placeholder="description"
              name="description"
              onChange={handleInputChange}
              value={inputs.description}
              validators={validators.description}
              errorMessages={errorMessages.description}
            />
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              placeholder="category"
              name="category"
              value={inputs.category}
              label="Category"
              onChange={handleInputChange}
            >
              <MenuItem value={'guitar'}>Guitars</MenuItem>
              <MenuItem value={'drums'}>Drums</MenuItem>
              <MenuItem value={'bass'}>Bass</MenuItem>
            </Select>

            <TextValidator
              fullWidth
              type="file"
              name="file"
              accept="image/*, video/*, audio/*"
              onChange={handleInputChange}
            />

            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                fullWidth
                color="primary"
                type="submit"
                variant="contained"
                disabled={!inputs.file}
              >
                Upload
              </Button>
            )}
          </ValidatorForm>
        </Grid>
      </Grid>
      {inputs.file && (
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={4}>
            <img
              style={{
                width: '100%',
              }}
              src={preview}
              alt="preview"
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Upload;
