import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.scss";
import classNames from "classnames/bind";
import img from "~/assets/adorable-dog-fantasy-style_23-2151147843.jpg";
import Grid from "@mui/material/Grid";
import { Button, Fade, Paper } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { blue } from "@mui/material/colors";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "~/config/firebase";
import { doc, setDoc } from "firebase/firestore";

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
 const [registrationError,setRegistrationError] = useState("");
  const navigate = useNavigate();

  const validateInputs = () => {
    let valid = true;

    if (name.trim() === "") {
      setErrorName("Hãy nhập Họ và tên");
      valid = false;
      return valid;
    } else {
      setErrorName("");
    }
    if (username.trim() === "") {
      setErrorName("Hãy nhập Username");
      valid = false;
      return valid;
    } else {
      setErrorName("");
    }
    if (phone.trim() === "") {
      setErrorName("Hãy nhập số điện thoại");
      valid = false;
      return valid;
    } else {
      setErrorName("");
    }
    if (email.trim() === "") {
      setErrorName("Hãy nhập Email");
      valid = false;
      return valid;
    } else {
      setErrorName("");
    }

    if (password.trim() === "") {
      setErrorName("Hãy nhập mật khẩu!");
      valid = false;
      return valid;
    } else if (password.length < 5) {
      setErrorName("Mật khẩu phải từ 5 kí tự trở lên!");
      valid = false;
      return valid;
    } else {
      setErrorName("");
    }

    if (confirmPassword.trim() === "") {
      setErrorName("Hãy nhập lại mật khẩu!");
      valid = false;
      return valid;
    } else if (password !== confirmPassword) {
      setErrorName("Mật khẩu nhập lại không khớp!");
      valid = false;
      return valid;
    } else {
      setErrorName("");
    }

    return valid;
  };

  const handleRegister = () => {
    if (!validateInputs()) {
      return;
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Registration successful
        const user = userCredential.user;
        const uid = user.uid;

        // Store the additional information in Firebase Realtime Database
        setDoc(doc(db, "users", uid), {
          name: name,
          username,
          phone: phone,
        })
          .then(() => {
            setRegistrationSuccess(true);
            // Redirect user to login page after successful registration
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          })
          .catch((error) => {
            console.error("Error adding user information: ", error);
            setRegistrationError("Lỗi khi lưu thông tin người dùng!");
          });
      })
      .catch((error) => {
        // Registration failed
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
          <div className={cx("inputContainer")}>
            <div className={cx("registerField")}>
              <input value={name} placeholder="Họ và tên" onChange={(ev) => setName(ev.target.value)} className={cx("inputBox")} />
              <label className={cx("errorLabel")}>{}</label>
            </div>
            <div className={cx("registerField")}>
              <input value={username} placeholder="Username" onChange={(ev) => setUsername(ev.target.value)} className={cx("inputBox")} />
              <label className={cx("errorLabel")}>{}</label>
            </div>
            <div className={cx("registerField")}>
              <input value={email} placeholder="Email" onChange={(ev) => setEmail(ev.target.value)} className={cx("inputBox")} />
              <label className={cx("errorLabel")}>{}</label>
            </div>
            <div className={cx("registerField")}>
              <input value={phone} placeholder="Số điện thoại" onChange={(ev) => setPhoneNumber(ev.target.value)} className={cx("inputBox")} />
              <label className={cx("errorLabel")}>{}</label>
            </div>
            <div className={cx("registerField")}>
              <input value={password} type="password" placeholder="Mật khẩu" onChange={(ev) => setPassword(ev.target.value)} className={cx("inputBox")} />
              <label className={cx("errorLabel")}>{}</label>
            </div>
            <div className={cx("registerField")}>
              <input value={confirmPassword} type="password" placeholder="Nhập lại mật khẩu" onChange={(ev) => setConfirmPassword(ev.target.value)} className={cx("inputBox")} />
              <label className={cx("errorLabel")}>{}</label>
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
      {errorName && (
        <Fade in={errorName} timeout={1000}>
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
            <AlertTitle sx={{ fontSize: "1.2rem", fontWeight: "Bold" }}>Lỗi:</AlertTitle>
            {errorName}
          </Alert>
        </Fade>
      )}
    </div>
  );
};

export default Register;
