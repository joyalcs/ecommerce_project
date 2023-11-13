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
import { useResetPasswordByEmailMutation } from '../services/user/userAuthApi';
import { useNavigate, useParams } from 'react-router-dom';


const ResetPasswordPage = () => {
  const theme = createTheme();
  const [serverMsg, setServerMsg] = useState({})
  const [resetPasswordByEmail] = useResetPasswordByEmailMutation()
  const {uid, token} = useParams();
  const navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData ={
      password: data.get('password'),
      password2: data.get('password2')
    }
    const res = await resetPasswordByEmail({actualData, uid, token})
    if(res.error){
      setServerMsg({})
      console.log(res.error);
    }
    if(res.data){
      setServerMsg(res.data)
      document.getElementById('reset_password_form').reset()
      setTimeout(() => {
        navigate("/signin")
      }, 3000)
    }
    document.querySelector('form').reset();

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
          marginTop: '50px',
        }}
      >
        <Typography component="h1" variant="h5">
          Change Password
        </Typography>
        <form onSubmit={handleSubmit} id="reset_password_form">
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

export default ResetPasswordPage
