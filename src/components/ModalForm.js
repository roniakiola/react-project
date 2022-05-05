import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {Grid, Typography, InputLabel, Select, MenuItem} from '@mui/material';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {useNavigate} from 'react-router-dom';
import useForm from '../hooks/FormHooks';
import {useState, useEffect} from 'react';
// import {appID} from '../utils/variables';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import SellIcon from '@mui/icons-material/Sell';

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
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

  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const navigate = useNavigate();

  const doUpload = async () => {
    try {
      console.log('doUpload');
      // lisätään filtterit descriptioniin
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
    <div>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        style={{
          backgroundColor: '#1394DF',
          color: 'white',
        }}
      >
        New Sales Notice <SellIcon style={{marginLeft: '15px'}} />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <Typography component="h1" variant="h2" gutterBottom>
                New Sale
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
                  fullWidth
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
                <DialogActions>
                  <Button
                    onClick={handleClose}
                    color="error"
                    variant="outlined"
                    style={{border: '2px solid'}}
                  >
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    color="primary"
                    type="submit"
                    variant="contained"
                    disabled={!inputs.file}
                    style={{
                      backgroundColor: '#1394DF',
                      color: 'white',
                    }}
                  >
                    Upload
                  </Button>
                </DialogActions>
              </ValidatorForm>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}
