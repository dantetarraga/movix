import HeroBanner from '../heroBanner/HeroBanner';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import './styles.scss';
import { useAuth } from '../../auth/AuthContext';

const useStyles = makeStyles((theme) => ({
    textField: {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#fff',
            },
            '& input': {
                color: '#f0f0f0',
            },
            '&:hover fieldset': {
                borderColor: 'white',
            },
            '& input:focus': {
                color: 'white',
            },
        },
        '& .MuiInputLabel-root': {
            color: '#f0f0f0',
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: 'white',
        },
    },
}));

const FormSignUp = () => {
    const classes = useStyles();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
    });
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        console.log("Sign up...");
        event.preventDefault();

        axios.post('http://localhost:3000/user/create', formData, {
            header: {
                'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                console.log(res);
                setAuth(true);
                localStorage.getItem('email', formData.email)
                navigate('/')
            })
            .catch((err) => {
                console.log(err.response);
            });
    };

    return (
        <div className='signup'>
            <HeroBanner />

            <Grid
                container
                justifyContent="center"
                alignItems="center"
                className='signup__grid grid'
            >

                <Grid item xs={12} sm={8} md={6} lg={4} className='grid__form'>
                    <Paper className="form__paper paper" elevation={3}>
                        <header className='signup__header'>
                            <Typography variant="h3" gutterBottom>
                                Trailers de series y peliculas ilimitadas
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                                Disfruta donde quieras.
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                ¿Quieres ver movix ya? Ingresa tu correo electrónico y una contraseña para crear una cuenta
                            </Typography>
                        </header>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Nombre de usuario"
                                variant="outlined"
                                type="test"
                                name="username"
                                margin="normal"

                                value={formData.username}
                                onChange={handleChange}
                                required
                                className={classes.textField}
                            />
                            <TextField
                                fullWidth
                                label="Correo Electrónico"
                                variant="outlined"
                                type="email"
                                name="email"
                                margin="normal"

                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={classes.textField}
                            />
                            <TextField
                                className={classes.textField}
                                fullWidth
                                label="Contraseña"
                                variant="outlined"
                                type="password"
                                name="password"
                                margin="normal"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                            <Button
                                className="submit-button"
                                fullWidth
                                variant="contained"
                                style={{ background: '#e50914', color: '#fff', marginTop: '50px' }}
                                type="submit"
                            >
                                Registrarse
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </div >
    )
}

export default FormSignUp;