import { AccountCircle, CheckBox, Lock } from "@mui/icons-material";
import {
  Button,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../auth/AuthContext";
import HeroBanner from "../heroBanner/HeroBanner";
import PasswordResetDialog from "../passwordResetDialog/PasswordResetDialog";
import "./style.scss";

const useStyles = makeStyles((theme) => ({
  textField: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#fff",
      },
      "& input": {
        color: "#f0f0f0",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "& input:focus": {
        color: "white",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#f0f0f0",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "white",
    },
  },
}));

const Login = () => {
  const classes = useStyles();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remenberMe, setRememberMe] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [passwordReset, setPasswordReset] = useState(false);
  const { setAuth } = useAuth();

  const notify = () =>
    toast.success(
      "Contraseña actualizada. Por favor, verifica tu correo electronico.",
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );

  const handlePasswordReset = () => {
    setPasswordReset(true);
    notify();
  };

  const handleEmailOrUsernameChange = (event) => {
    setEmailOrUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    console.log("Login...");
    axios
      .post(
        "http://localhost:3000/login",
        { emailOrUsername: emailOrUsername, password: password },
        { withCredentials: true },
        {
          header: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("email", res.data.email);

        setTimeout(() => {
          console.log(res.data);
        }, 2000);

        setAuth(true);
        navigate("/");
      })
      .catch((err) => {
        console.error(err.response);

        if (err.response && err.response.status === 401) {
          setError("Usuario o contraseña incorrectos");
        } else {
          setError(
            "Se produjo un error al iniciar sesión. Por favor, inténtalo de nuevo."
          );
        }
      });
  };

  const handleSubscribeClick = () => {
    navigate("/signup");
  };

  const handleForgotPassword = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="login">
      <HeroBanner />

      <Grid
        container
        justifyContent="center"
        alignItems="center"
        className="login__grid grid"
      >
        <Grid item xs={10} sm={8} md={6} lg={4} className="grid__form form">
          <Paper
            elevation={3}
            style={{ padding: "60px" }}
            className="form__paper paper"
          >
            <Typography variant="h4" gutterBottom>
              Iniciar Sesión
            </Typography>
            <form onSubmit={handleLogin} className="paper__form form">
              <TextField
                fullWidth
                label="Correo Electrónico o nombre de usuario"
                variant="outlined"
                margin="normal"
                name="email"
                value={emailOrUsername}
                onChange={handleEmailOrUsernameChange}
                required
                autoFocus
                InputProps={{
                  startAdornment: (
                    <AccountCircle fontSize="small" className="icon" />
                  ),
                }}
                className={classes.textField}
              />
              <TextField
                className={classes.textField}
                fullWidth
                label="Contraseña"
                variant="outlined"
                margin="normal"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                InputProps={{
                  startAdornment: <Lock fontSize="small" className="icon" />,
                }}
              />
              {error && (
                <Typography variant="body2" color="error" align="center">
                  {error}
                </Typography>
              )}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: "20px", background: "#e50914" }}
              >
                Iniciar Sesión
              </Button>

              <div className="opcions form__opcions">
                <FormControlLabel
                  className="form__checkbox"
                  control={<CheckBox name="gilad" />}
                  label="Recuerdame"
                />

                <span className="form__link" onClick={handleForgotPassword}>
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
              <div className="form__register">
                <Typography variant="body1" className="additional-text">
                  ¿Primera vez en Movix?
                </Typography>
                <span className="subscribe-link" onClick={handleSubscribeClick}>
                  Suscríbete ahora
                </span>
              </div>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <PasswordResetDialog
        open={openDialog}
        onClose={handleCloseDialog}
        passwordReset={handlePasswordReset}
      />
      {passwordReset && <ToastContainer />}
    </div>
  );
};

export default Login;
