import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import img from "~/assets/adorable-dog-fantasy-style_23-2151147843.jpg";
import Grid from "@mui/material/Grid";
import { Button, Fade, Paper } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { LayoutContext } from "~/App";
import { useContext } from "react";
import { blue } from "@mui/material/colors";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "~/config/firebase";
import { collection, query, doc, getDoc, where } from "firebase/firestore";

const cx = classNames.bind(styles);

const Login = () => {
  const [chora, setChora] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorName, setErrorName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (chora) {
      setTimeout(() => {
        setChora(false);
      }, 1500);
      setTimeout(() => {
        navigate(loggedIn && loggedIn.role === "1" ? `/admin` : `/customer`);
      }, 2000);
    }
  }, [loggedIn]);

  const logIn = async () => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      setErrorName("");
      const user = userCredential.user;
      setLoggedIn(true);
      setChora(true);
      localStorage.setItem("isLogged", JSON.stringify({ login: true }));

      // Retrieve additional user data from Firestore if needed
      // Example: Fetch user data based on user UID
      const userData = await getDoc(doc(db, "users", user.uid));

      if (userData.exists()) {
        const info = userData.data()
        // setRole(userData.role);
        localStorage.setItem("username", info.name);
        localStorage.setItem("role", info.role);
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


  const onButtonClick = () => {
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
    if (password.length < 5) {
      setPasswordError("Mật khẩu phải từ 5 kí tự trở lên!");
      return;
    }
    logIn();
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
              onClick={() => {
                onButtonClick();
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
