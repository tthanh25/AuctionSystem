import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import img from "~/assets/adorable-dog-fantasy-style_23-2151147843.jpg";
import Grid from "@mui/material/Grid";
import { Button, Fade, Paper } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { LayoutContext, getRole } from "~/App";
import { useContext } from "react";
import { blue } from "@mui/material/colors";

import firebaseService from "~/services/firebase";

const cx = classNames.bind(styles);

const Login = () => {
  const [chora, setChora] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorName, setErrorName] = useState("");
  const [role, setRole] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    if (chora) {
      setTimeout(() => {
        setChora(false);
        
        console.log("1:",role)
      }, 1500);
      setTimeout(() => {
        navigate(role == "1" ? `/admin` : `/customer`);
      }, 2000);
    }
  }, [loggedIn]);

  const logIn = async () => {
    try {
      const userCredential = await firebaseService.signIn(username, password);
      setErrorName("");
      const user = userCredential.user;

      // Retrieve additional user data from Firestore if needed
      const userData = await firebaseService.getUserData(user.uid);
      if (userData) {
        localStorage.setItem("username", userData.name);
        localStorage.setItem("role", userData.role);
        localStorage.setItem("uid", user.uid);
        console.log(userData.role)
        setRole(userData.role);
        
        console.log("2: ",role);
        setLoggedIn(true);
        setChora(true);
        localStorage.setItem("isLogged", true);
        
      } else {
        console.log("No such data of user");
      }
    } catch (error) {
      const errorMessage = error.message;
      setErrorName(errorMessage);
      console.error("Error logging in:", errorMessage);
      // Handle errors, update state or show error message to the user
    }
  };

  const onButtonClick = async () => {
    setUsernameError("");
    setPasswordError("");
    setErrorName("");
    if (username.trim() === "") {
      setUsernameError("Hãy nhập username");
      return;
    }
    if (password.trim() === "") {
      setPasswordError("Hãy nhập mật khẩu!");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Mật khẩu phải từ 6 kí tự trở lên!");
      return;
    }
    await logIn();
  };

  return (
    <div>
      <Grid container spacing={0} direction="row" className={cx("container")}>
        <Paper className={cx("paper")} elevation={0}>
          <img src={img} alt="thumbnail" className={cx("img")} />
        </Paper>
        <Paper className={cx("paper")} elevation={0}>
          <div className={cx("titleContainer")}>
            <div>Đăng nhập</div>
          </div>
          <br />
          <div className={cx("inputContainer")}>
            <input value={username} placeholder="Nhập Email" onChange={(ev) => setUsername(ev.target.value)} className={cx("inputBox")} />
            <label className={cx("errorLabel")}>{usernameError}</label>
          </div>
          <br />
          <div className={cx("inputContainer")}>
            <input value={password} type="password" placeholder="Nhập mật khẩu" onChange={(ev) => setPassword(ev.target.value)} className={cx("inputBox")} />
            <label className={cx("errorLabel")}>{passwordError}</label>
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
              onClick={async () => {
                await onButtonClick();
              }}
            >
              Đăng nhập
            </Button>
            <div>
              <p>
                Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
              </p>
              <br />
              <p></p>
            </div>
          </div>
        </Paper>
      </Grid>
      {chora && (
        <Fade in={chora} timeout={1000}>
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
            Đăng nhập thành công!
          </Alert>
        </Fade>
      )}
      {errorName && !loggedIn && (
        <Fade in={errorName} timeout={500}>
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

export default Login;
