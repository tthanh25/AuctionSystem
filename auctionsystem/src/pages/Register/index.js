import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.scss";
import classNames from "classnames/bind";
import img from "~/assets/adorable-dog-fantasy-style_23-2151147843.jpg";
import Grid from "@mui/material/Grid";
import { Button, Fade, Paper } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { blue } from "@mui/material/colors";

import firebaseService from "~/services/firebase";

const cx = classNames.bind(styles);

const Register = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorName, setErrorName] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (registrationSuccess)
      setTimeout(() => {
        navigate("/login");
      }, 2000);
  }, [registrationSuccess]);

  const validateInputs = () => {
    let valid = true;

    if (name.trim() === "") {
      setErrorName("Hãy nhập Họ và tên");
      valid = false;
    } else if (username.trim() === "") {
      setErrorName("Hãy nhập Username");
      valid = false;
    } else if (phone.trim() === "") {
      setErrorName("Hãy nhập số điện thoại");
      valid = false;
    } else if (email.trim() === "") {
      setErrorName("Hãy nhập Email");
      valid = false;
    } else if (password.trim() === "") {
      setErrorName("Hãy nhập mật khẩu!");
      valid = false;
    } else if (password.length < 6) {
      setErrorName("Mật khẩu phải từ 6 kí tự trở lên!");
      valid = false;
    } else if (confirmPassword.trim() === "") {
      setErrorName("Hãy nhập lại mật khẩu!");
      valid = false;
    } else if (password !== confirmPassword) {
      setErrorName("Mật khẩu nhập lại không khớp!");
      valid = false;
    } else {
      setErrorName("");
    }

    return valid;
  };

  const handleRegister = async () => {
    setErrorName("");
    setRegistrationError("");
    setRegistrationSuccess(false);

    if (!validateInputs()) {
      setRegistrationError(errorName);
      return;
    }

    try {
      const userCredential = await firebaseService.createAccount(email, password);
      const user = userCredential.user;
      const uid = user.uid;

      // Store additional information in Firestore
      await firebaseService.setUserDocument(uid, {
        name: name,
        username: username,
        phone: phone,
        role: 0,
      });

      setRegistrationSuccess(true);
    } catch (error) {
      const errorMessage = error.message;
      setRegistrationError(errorMessage);
      console.error("Registration failed:", errorMessage);
    }
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
          <div className={cx("inputContainer")}>
            <div className={cx("registerField")}>
              <input value={name} placeholder="Họ và tên" onChange={(ev) => setName(ev.target.value)} className={cx("inputBox")} />
            </div>
            <div className={cx("registerField")}>
              <input value={username} placeholder="Username" onChange={(ev) => setUsername(ev.target.value)} className={cx("inputBox")} />
            </div>
            <div className={cx("registerField")}>
              <input value={email} placeholder="Email" onChange={(ev) => setEmail(ev.target.value)} className={cx("inputBox")} />
            </div>
            <div className={cx("registerField")}>
              <input value={phone} placeholder="Số điện thoại" onChange={(ev) => setPhoneNumber(ev.target.value)} className={cx("inputBox")} />
            </div>
            <div className={cx("registerField")}>
              <input value={password} type="password" placeholder="Mật khẩu" onChange={(ev) => setPassword(ev.target.value)} className={cx("inputBox")} />
            </div>
            <div className={cx("registerField")}>
              <input value={confirmPassword} type="password" placeholder="Nhập lại mật khẩu" onChange={(ev) => setConfirmPassword(ev.target.value)} className={cx("inputBox")} />
            </div>
          </div>
          <div className={cx("inputContainer")}>
            <Button
              size="Large"
              disableFocusRipple
              disableRipple
              component="li"
              className={cx("login")}
              sx={{
                marginTop: "32px",
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
        <Fade in={registrationSuccess} timeout={500}>
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
        <Fade in={registrationError} timeout={500}>
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
