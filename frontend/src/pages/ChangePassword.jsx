import React, {useState} from 'react'
import {
    Button,
    CssBaseline,
    TextField,
    Grid,
    Typography,
    Container,
    Alert,
  } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';
import { getToken } from '../services/localStorageService';
import { useChangePasswordMutation } from '../services/user/userAuthApi';
import { useSelector } from 'react-redux';


const ChangePassword = () => {
    const theme = createTheme();
    const [serverMsg, setServerMsg] = useState({})
    const [changePassword] = useChangePasswordMutation();
    const {access_token} = getToken()

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const actualData = {
            password: data.get('password'),
            password2: data.get('password2')
        }
        const res = await changePassword({actualData, access_token})
        console.log(access_token);
        console.log(actualData);
        if(res.error){

            setServerMsg(res.error)
        }
        if (res.data) {
            console.log(res.data)
            setServerMsg(res.data)
            document.querySelector('form').reset();
        }
    }
    const myData = useSelector(state => state.user)
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
          <Typography component="h1" variant="h5">
            Change Password
          </Typography>
          <form onSubmit={handleSubmit} id="change_password_form">
            <Grid container spacing={2}  sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  type="password"
                  id="password"
                  label="Password"
                  name="password"
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
              Change Password
            </Button>

          </form>
            {serverMsg.msg ? <Alert severity='success'>{serverMsg.msg}</Alert> : ''}
        </div>
      </Container>
    </ThemeProvider>
  )
}

export default ChangePassword
