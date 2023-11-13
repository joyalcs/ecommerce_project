import React from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useAddShippingAddressMutation } from '../services/address/AddressApi';
import { getToken } from '../services/localStorageService';

const AddressPage = () => {
    const theme = createTheme();
    const navigate = useNavigate();
    const {access_token} = getToken()
    const [addShippingAddress] = useAddShippingAddressMutation();
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const actualData = {
            address: data.get('address'),
            city: data.get('city'),
            postalCode: data.get('postalCode'),
            country: data.get('country'),
            phone_number: data.get('phone_number'),
        }
        const res = await addShippingAddress({actualData, access_token})
        if(res.error){
            console.log(res.error);
        }
        if(res.data){
            console.log(res.data)

        }
        document.querySelector('form').reset();
        navigate("/checkout")
    }
  return (
    <>
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

          <Typography component="h1" variant="h5">
            Address
          </Typography>
          <form id="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="city"
                  label="City"
                  name="city"
                  type='city'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="postalCode"
                  label="Postal Code"
                  name="postalCode"

                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="country"
                  label="Country"
                  name="country"

                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="phone_number"
                  label="Phone Number"
                  id="phone_number"

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
              Add Address
            </Button>
          </form>
        </div>
      </Container>
    </ThemeProvider>

    </>
  )
}

export default AddressPage
