import React, {useState} from 'react'
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
import { createTheme, ThemeProvider } from '@mui/material';
import { useSendEmailResetPasswordMutation } from '../services/user/userAuthApi';

const ResetEmailPage = () => {
    const theme = createTheme();
    const [serverMsg, setServerMsg] = useState({})
    const [sendEmailResetPassword, { isLoading }] = useSendEmailResetPasswordMutation()
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const actualData = {
            email: data.get('email')
        }
        const res = await sendEmailResetPassword(actualData)
        if(res.error){
            console.log(res.error);
            setServerMsg({})
        }
        if(res.data){
            setServerMsg(res.data)
            document.getElementById('password-reset-email-form').reset()
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
            Reset Password
          </Typography>
          <form onSubmit={handleSubmit} id='password_reset_email_form'>
            <Grid container spacing={2}  sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
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
              Submit
            </Button>

          </form>
            {serverMsg.msg ? <Alert severity='success'>{serverMsg.msg}</Alert> : ''}
        </div>
      </Container>
    </ThemeProvider>
  )
}

export default ResetEmailPage
