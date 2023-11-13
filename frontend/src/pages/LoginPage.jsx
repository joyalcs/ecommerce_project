import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Typography,
  Container,
  Alert,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserToken } from '../features/User/authSlice';
import { storeToken, getToken } from '../services/localStorageService';
import { useLoginUserMutation } from '../services/user/userAuthApi';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const theme = createTheme();
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      username: data.get('username'),
      password: data.get('password'),
    };

    try {
      const res = await loginUser(actualData);
      if (res.error) {
        setServerError(res.error);
      } else if (res.data) {
        storeToken(res.data);
        const { access_token } = getToken();
        dispatch(setUserToken({ access_token: access_token }));
        navigate('/');
      }
    } catch (error) {
      setServerError({ message: 'An error occurred. Please try again later.' });
    }
    document.querySelector('form').reset();

  };

  let { access_token } = getToken();
  useEffect(() => {
    dispatch(setUserToken({ access_token: access_token }));
  }, [access_token, dispatch]);

  return (

    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">

      <CssBaseline />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '50px',
          }}
        >
          <Avatar>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}  sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"

                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ margin: '16px 0' }}
            >
              Sign In
            </Button>




            <Grid container justifyContent="flex-end">
              {/* <Grid item> */}
                <Link className='bg-white text-dark ms-3 text-decoration-none' to="/signup" >
                  Don't you have an account? Sign up
                </Link>
                <Link className='bg-white text-dark ms-3 text-decoration-none' to="/send_password_reset_email" >
                  Forgot Password?
                </Link>
              {/* </Grid> */}
            </Grid>
          </form>
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
