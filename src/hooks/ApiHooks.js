// TODO: add necessary imports
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {baseUrl} from '../utils/variables';

const fetchJson = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      const message = json.message;
      throw new Error(message);
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

const useMedia = (userId, category) => {
  const {update} = useContext(MediaContext);
  const [mediaArray, setMediaArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const getMedia = async () => {
    try {
      setLoading(true);
      let media;
      if (category === 'profile') {
        const fetchOptions = {
          method: 'GET',
          headers: {
            'x-access-token': localStorage.getItem('token'),
          },
        };
        media = await fetchJson(baseUrl + 'media/user', fetchOptions);
      } else {
        media = await useTag().getTag(category);
      }
      const allFiles = await Promise.all(
        media.map(async (file) => {
          // Purukumia: tietokanta vaatii tokenin username-hakua varten - tehdään näin niin saadaan kirjautumattakin sisältöä näkyviin
          if (userId) {
            const fileOwner = await getNameOfUser(
              file.file_id,
              localStorage.getItem('token')
            );
            const getFile = await fetchJson(`${baseUrl}media/${file.file_id}`);
            Object.assign(getFile, {username: fileOwner});
            return getFile;
          } else {
            const getFile = await fetchJson(`${baseUrl}media/${file.file_id}`);
            return getFile;
          }
        })
      );

      setMediaArray(allFiles);
    } catch (err) {
      // BUGI: Joku bugi heittää alerttia refreshillä, tsekkaa safeJsonParse myöhemmin. Ei kuitenkaan aitoa vaikutusta sovelluksen toimintaan.
      // alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMedia();
  }, [userId, update]);

  const postMedia = async (formdata, token) => {
    try {
      setLoading(true);
      const fetchOptions = {
        method: 'POST',
        headers: {
          'x-access-token': token,
        },
        body: formdata,
      };
      return await fetchJson(baseUrl + 'media', fetchOptions);
    } finally {
      setLoading(false);
    }
  };

  const deleteMedia = async (fileId, token) => {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    return await fetchJson(baseUrl + 'media/' + fileId, fetchOptions);
  };

  const putMedia = async (fileId, data, token) => {
    try {
      setLoading(true);
      const fetchOptions = {
        method: 'PUT',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      return await fetchJson(baseUrl + 'media/' + fileId, fetchOptions);
    } finally {
      setLoading(false);
    }
  };

  return {mediaArray, postMedia, deleteMedia, putMedia, loading};
};

const useUser = () => {
  const getUser = async (token) => {
    const fetchOptions = {
      headers: {
        'x-access-token': token,
      },
    };
    return await fetchJson(baseUrl + 'users/user', fetchOptions);
  };

  const getUsername = async (username) => {
    const checkUser = await fetchJson(baseUrl + 'users/username/' + username);
    return checkUser.available;
  };

  const getUserById = async (userId, token) => {
    const fetchOptions = {
      headers: {
        'x-access-token': token,
      },
    };
    return await fetchJson(baseUrl + 'users/' + userId, fetchOptions);
  };

  const postUser = async (inputs) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    return await fetchJson(baseUrl + 'users', fetchOptions);
  };

  return {getUser, postUser, getUsername, getUserById};
};

const useLogin = () => {
  const postLogin = async (inputs) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    return await fetchJson(baseUrl + 'login', fetchOptions);
  };
  return {postLogin};
};

const useTag = () => {
  const getTag = async (tag) => {
    const tagResult = await fetchJson(baseUrl + 'tags/' + tag);
    if (tagResult.length > 0) {
      return tagResult;
    } else {
      throw new Error('No results');
    }
  };

  const postTag = async (data, token) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    return await fetchJson(baseUrl + 'tags', fetchOptions);
  };
  return {getTag, postTag};
};
const getNameOfUser = async (fileId, token) => {
  const fetchOptions = {
    method: 'GET',
    headers: {
      'x-access-token': token,
    },
  };
  const fileInfo = await fetchJson(baseUrl + 'media/' + fileId, fetchOptions);
  // tiedoston user_id
  const fileOwnerId = fileInfo.user_id;
  // user_id:llä username
  const userInfo = await fetchJson(
    baseUrl + 'users/' + fileOwnerId,
    fetchOptions
  );
  const usrName = userInfo.username;
  return usrName;
};

export {useMedia, useLogin, useUser, useTag, getNameOfUser};
