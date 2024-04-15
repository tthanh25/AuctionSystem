import React from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";
import firebaseService from "~/services/firebase";

const cx = classNames.bind(styles);

function Header() {
  const navigate = useNavigate();
  const name = localStorage.getItem("username");

  const handleSignOut = async () => {
    try {
      await firebaseService.signOut();
      localStorage.clear(); // Clear any local data related to user
      navigate("/"); // Navigate to the home page after sign out
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle error if needed
    }
  };

  return (
    <header className={cx("wrapper")} style={{ background: "#01579b" }}>
      <nav className={cx("inner-header")}>
        <ul>
        <Button
            size="medium"
            disableFocusRipple
            disableRipple
            component="li"
            sx={{
              display:"flex",
              flexDirection:"flex-start",
              alignItems: "flex-start",
              color: "white",
              "&:hover": {
                backgroundColor: blue[500],
                color: "white",
              },
            }}
            onClick={() => {navigate("/admin")}} 
          >
            Trang chủ
          </Button>
        <Button
            size="medium"
            disableFocusRipple
            disableRipple
            component="li"
            sx={{
              display:"flex",
              flexDirection:"flex-start",
              alignItems: "flex-start",
              color: "white",
              "&:hover": {
                backgroundColor: blue[500],
                color: "white",
              },
            }}
            onClick={() => {navigate("/manage")}} 
          >
            Quản lí
          </Button>
        <Button
            size="medium"
            disableFocusRipple
            disableRipple
            component="li"
            sx={{
              display:"flex",
              flexDirection:"flex-start",
              alignItems: "flex-start",
              color: "white",
              "&:hover": {
                backgroundColor: blue[500],
                color: "white",
              },
            }}
            onClick={() => {navigate("/upload")}} 
          >
            Thêm đấu giá
          </Button>
          <li className={cx("name")}>
            <p>Xin chào admin: {name}</p>
          </li>
          <Button
            size="medium"
            disableFocusRipple
            disableRipple
            component="li"
            className={cx("login")}
            sx={{
              position:"fixed",
              right:"16px",
              alignItems: "flex-end",
              color: "white",
              "&:hover": {
                backgroundColor: blue[500],
                color: "white",
              },
            }}
            onClick={handleSignOut} // Call handleSignOut function on button click
          >
            Đăng xuất
          </Button>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
