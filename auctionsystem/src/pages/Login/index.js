import React, { useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import img from "~/assets/adorable-dog-fantasy-style_23-2151147843.jpg";
import Grid from "@mui/material/Grid";
import { Button, Fade, Link, Paper } from "@mui/material";
import Header from "~/components/Layout/Header";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { LayoutContext } from "~/App";
import { useContext } from "react";
import { blue } from "@mui/material/colors";

import { getAuth, signInWithEmailAndPassword, connectAuthEmulator } from "firebase/auth";
import { db } from "~/config/firebase";


const cx = classNames.bind(styles);

const Login = () => {
  const [chora, setChora] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorName, setErrorName] = useState("");
  const navigate = useNavigate();

//   const setLogged = useContext(LayoutContext);

  useEffect(() => {
    if (chora) {
      // console.log('chora true');
      setTimeout(() => {
        // console.log('chora false');
        setChora(false);
      }, 1500);
      if (role === "1")
        setTimeout(() => {
          navigate(`/admin`);
        }, 2000);
      else
        setTimeout(() => {
          navigate(
            `/customer`
          );
        }, 2000);
    }
  }, [loggedIn]);

  const logIn = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        setErrorName("");
        // Signed in successfully
        const user = userCredential.user;
        setLoggedIn(true);
        setChora(true);
        localStorage.setItem("isLogged", JSON.stringify({ login: true }));
        // Retrieve additional user data from Firestore if needed
        // Example: Fetch user data based on username
        db.collection("users")
          .where("username", "==", username)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              setRole(userData.role);
              localStorage.setItem("username", JSON.stringify({ username, token: user.accessToken }));
              localStorage.setItem("role", JSON.stringify({ role: userData.role }));
              localStorage.setItem("Token", user.accessToken);
            });
          })
          .catch((error) => {
            console.error("Error getting user data:", error);
            setErrorName(error);
          });
      })
      .catch((error) => {
        // Error occurred during sign-in
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorName(errorMessage);
        console.error("Error logging in:", errorMessage);
        // Handle errors, update state or show error message to the user
      });
  };

  const onButtonClick = () => {
    setUsernameError("");
    setPasswordError("");
    setErrorName("");
    //setLoggedIn(false);
    if (username.trim() === "") {
      setUsernameError("Hãy nhập username");
      return;
    }

    // if (!/^[a-zA-Z0-9_-]+$/.test(username.trim())) {
    //   setUsernameError("Username không hợp lệ!");
    //   return;
    // }

    if (password.trim() === "") {
      setPasswordError("Hãy nhập mật khẩu!");
      return;
    }

    if (password.length < 5) {
      setPasswordError("Mật khẩu phải từ 5 kí tự trở lên!");
      return;
    }

    logIn();

    // console.log(username, password)
    // Authenticate user
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
            <input
              value={username}
              placeholder="Nhập username"
              onChange={(ev) => setUsername(ev.target.value)}
              className={cx("inputBox")}
            />
            <label className={cx("errorLabel")}>{usernameError}</label>
          </div>
          <br />
          <div className={cx("inputContainer")}>
            <input
              value={password}
              type="password"
              placeholder="Nhập mật khẩu"
              onChange={(ev) => setPassword(ev.target.value)}
              className={cx("inputBox")}
            />
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
              backgroundColor: '#01579b',
              "&:hover": {
                backgroundColor: blue[500],
                color: "white",
              },
            }}
            onClick={() => {
              onButtonClick();
            }}
          >
            Đăng nhập
          </Button>
          <div>
            <p>Bạn chưa có tài khoản? <Link href ='/register' underline="hover">Đăng ký</Link></p>
            <br/>
            <p></p>
          </div>
          </div>
        </Paper>
      </Grid>
      {
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
            <AlertTitle sx={{ fontSize: "1.2rem", fontWeight: "Bold" }}>
              Thành công
            </AlertTitle>
            Đăng nhập thành công!
          </Alert>
        </Fade>
      }
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
