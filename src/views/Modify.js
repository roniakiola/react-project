import {Button, CircularProgress, Grid, Typography} from '@mui/material';
import {useMedia} from '../hooks/ApiHooks';
import {useNavigate, useLocation} from 'react-router-dom';
import useForm from '../hooks/FormHooks';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {safeParseJson} from '../utils/functions';
import {mediaUrl} from '../utils/variables';
import BackButton from '../components/BackButton';

const Modify = () => {
  const location = useLocation();
  const file = location.state.file;
  const {description} = safeParseJson(file.description) || {
    description: file.description,
    filters: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sepia: 0,
    },
  };

  console.log(file);

  const alkuarvot = {
    title: file.title,
    description: description,
  };

  const validators = {
    title: ['required', 'minStringLength: 3'],
    description: ['minStringLength: 5'],
  };

  const errorMessages = {
    username: ['required field', 'minimum 3 characters'],
    description: ['minimum 5 characters'],
  };

  const {putMedia, loading} = useMedia();
  const navigate = useNavigate();

  const doModify = async () => {
    try {
      console.log('doModify');
      // lisätään filtterit descriptioniin
      const desc = {
        description: inputs.description,
      };
      // tee sopiva objekti lähetettäväksi
      const data = {
        title: inputs.title,
        description: JSON.stringify(desc),
      };

      const token = localStorage.getItem('token');
      const mediaData = await putMedia(file.file_id, data, token);
      confirm(mediaData.message) && navigate(-1);
    } catch (err) {
      alert(err.message);
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(
    doModify,
    alkuarvot
  );

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <BackButton />
          <Typography component="h1" variant="h2" gutterBottom>
            Modify
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

            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                fullWidth
                color="primary"
                type="submit"
                variant="contained"
              >
                Save
              </Button>
            )}
          </ValidatorForm>
        </Grid>
      </Grid>
      {file && (
        <Grid container>
          <Grid item xs={12}>
            <img
              style={{
                width: '100%',
              }}
              src={mediaUrl + file.filename}
              alt="preview"
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Modify;
