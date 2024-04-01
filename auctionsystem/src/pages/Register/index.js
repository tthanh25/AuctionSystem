import React, { useState } from "react";
import { json, useNavigate } from "react-router-dom";
import styles from "./Register.module.scss";
import classNames from "classnames/bind";
import img from "~/assets/adorable-dog-fantasy-style_23-2151147843.jpg";
import Grid from "@mui/material/Grid";
import { Button, Fade, Paper } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { blue } from "@mui/material/colors";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const cx = classNames.bind(styles);

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const navigate = useNavigate();

  const validateInputs = () => {
    let valid = true;

    if (username.trim() === "") {
      setUsernameError("Hãy nhập username");
      valid = false;
    } else {
      setUsernameError("");
    }

    if (password.trim() === "") {
      setPasswordError("Hãy nhập mật khẩu!");
      valid = false;
    } else if (password.length < 5) {
      setPasswordError("Mật khẩu phải từ 5 kí tự trở lên!");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (confirmPassword.trim() === "") {
      setConfirmPasswordError("Hãy nhập lại mật khẩu!");
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Mật khẩu nhập lại không khớp!");
      valid = false;
    } else {
      setConfirmPasswordError("");
    }

    return valid;
  };

  const handleRegister = () => {
    if (!validateInputs()) {
      return;
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Registration successful
        const user = userCredential.user;
        setRegistrationSuccess(true);
        // Redirect user to login page after successful registration
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        // Registration failed
        const errorCode = error.code;
        const errorMessage = error.message;
        setRegistrationError(errorMessage);
        console.error("Registration failed:", errorMessage);
      });
  };

  return (
    <div>
      <Grid container spacing={0} direction="row" className={cx("container")}>
        <Paper className={cx("paper")}>
          <img src={img} alt="thumbnail" className={cx("img")} />
        </Paper>
        <Paper className={cx("paper")}>
          <div className={cx("titleContainer")}>
            <div>Đăng ký</div>
          </div>
          <br />
          <div className={cx("inputContainer")}>
            <input value={username} placeholder="Nhập username" onChange={(ev) => setUsername(ev.target.value)} className={cx("inputBox")} />
            <label className={cx("errorLabel")}>{usernameError}</label>
          </div>
          <br />
          <div className={cx("inputContainer")}>
            <input value={password} type="password" placeholder="Nhập mật khẩu" onChange={(ev) => setPassword(ev.target.value)} className={cx("inputBox")} />
            <label className={cx("errorLabel")}>{passwordError}</label>
          </div>
          <br />
          <div className={cx("inputContainer")}>
            <input value={confirmPassword} type="password" placeholder="Nhập lại mật khẩu" onChange={(ev) => setConfirmPassword(ev.target.value)} className={cx("inputBox")} />
            <label className={cx("errorLabel")}>{confirmPasswordError}</label>
          </div>
          <br />
          <div className={cx("inputContainer")}>
            <Button
              size="Large"
              disableFocusRipple
              disableRipple
              component="li"
              className={cx("login")}
              sx={{
                alignItems: "flex-end",
                color: "white",
                backgroundColor: "#01579b",
                "&:hover": {
                  backgroundColor: blue[500],
                  color: "white",
                },
              }}
              onClick={handleRegister}
            >
              Đăng ký
            </Button>
          </div>
        </Paper>
      </Grid>
      {registrationSuccess && (
        <Fade in={registrationSuccess} timeout={1000}>
          <Alert
            variant="filled"
            severity="success"
            sx={{
              position: "fixed",
              fontSize: "1.0rem",
              left: "48px",
              bottom: "48px",
              zIndex: 100,
              width: "45%",
            }}
          >
            <AlertTitle sx={{ fontSize: "1.2rem", fontWeight: "Bold" }}>Thành công</AlertTitle>
            Đăng ký thành công!
          </Alert>
        </Fade>
      )}
      {registrationError && (
        <Fade in={registrationError} timeout={1000}>
          <Alert
            variant="filled"
            severity="error"
            sx={{
              position: "fixed",
              fontSize: "1.0rem",
              left: "48px",
              bottom: "48px",
              zIndex: 100,
              width: "45%",
            }}
          >
            <AlertTitle sx={{ fontSize: "1.2rem", fontWeight: "Bold" }}>Lỗi</AlertTitle>
            {registrationError}
          </Alert>
        </Fade>
      )}
    </div>
  );
};

export default Register;
