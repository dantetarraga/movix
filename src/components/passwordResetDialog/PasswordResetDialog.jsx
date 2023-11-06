import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

const PasswordResetDialog = ({ open, onClose, passwordReset }) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);

    const handlePasswordReset = () => {
        passwordReset();
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSend = () => {
        axios.put('http://localhost:3000/user/password-reset', { email: email }, {
            header: {
                'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                console.log(res.data)
                setEmailError(false)
                handlePasswordReset();
                onClose();
            })
            .catch((err) => {
                console.error(err.response)
                setEmailError(true)
            })
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Restablecer tu contraseña</DialogTitle>
            <DialogContent>
                <Typography variant="body1" gutterBottom>
                    Ingresa tu correo electrónico de Movix y te enviaremos un enlace para restablecer tu contraseña.
                </Typography>
                <TextField
                    fullWidth
                    label="Correro Electronico"
                    type='email'
                    variant='outlined'
                    name='email'
                    onChange={handleEmailChange}
                    error={emailError}
                    helperText={emailError ? 'Correo incorrecto' : ''}
                />
            </DialogContent >
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <DialogActions style={{ justifyContent: 'flex-start', marginLeft: "15px" }}>
                    <Button onClick={handleSend} variant="contained" color="primary">
                        Enviar
                    </Button>
                    <Button onClick={onClose} variant="contained" color="inherit">
                        Cancelar
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default PasswordResetDialog;
