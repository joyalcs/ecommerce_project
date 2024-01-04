import React, { useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Typography,
  Container,
  Alert,
  AlertTitle
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../services/user/userAuthApi';
import { Link } from 'react-router-dom';


const RegisterPage = () => {
  const theme = createTheme();
  const [serverMsg, setServerMsg] = useState({})
  const navigate = useNavigate();
  const [registerUser, { isLoading } ] = useRegisterUserMutation();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData ={
      username: data.get('username'),
      email: data.get('email'),
      first_name: data.get('firstName'),
      last_name: data.get('lastName'),
      password: data.get('password'),
      password2: data.get('password2')

    }
    const res = await registerUser(actualData)
    if(res.error){
      setServerMsg(res.error)

    }
    if(res.data){
      setServerMsg(res.data)
      navigate("/signin")
    }


    document.querySelector('form').reset();
    console.log(message);
  }
  return (

    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">

      <CssBaseline />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '8px',
          }}
        >

          <Avatar>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          {serverMsg.msg ? <Alert severity='error'>{serverMsg.msg}</Alert> : ''}
          <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
              Use any of the special characters on the password. Password eg: Password@123
          </Alert>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
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
                  id="email"
                  label="Email Address"
                  name="email"
                  type='email'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"

                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"

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
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password2"
                  label="Confirm Password"
                  type="password"
                  id="password2"

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
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link className='bg-white text-dark ms-3 text-decoration-none'  to="/signin" >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>


        </div>
      </Container>
    </ThemeProvider>
  );
};

export default RegisterPage;
