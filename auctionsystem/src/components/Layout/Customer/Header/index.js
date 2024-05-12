import React from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";
import firebaseService from "~/services/firebase";
import logo from "~/assets/logoDog.jpg"
const cx = classNames.bind(styles);

function Header() {
  const navigate = useNavigate();
  const name = localStorage.getItem("username");

  const handleSignOut = async () => {
    try {
      await firebaseService.signOut();
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle error if needed
    }
  };

  return (
    <header className={cx("wrapper")} style={{ background: "#01579b" }}>
      <nav className={cx("inner-header")}>
        <ul>
        <li
            
            style={{
              maxWidth:"100%",maxHeight:"48px",
              display:"flex",
              flexDirection:"flex-start",
              alignItems: "flex-start",
              color: "white",
              "&:hover": {
                backgroundColor: blue[500],
                color: "white",
              },
            }}
          >
            <img src={logo} alt={"Logo"} style={{maxWidth:"100%",maxHeight:"48px", borderRadius:"8px"}} />
          </li>
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
            onClick={() => {navigate("/customer")}} 
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
            onClick={() => {navigate("/transaction")}} 
          >
            Đơn đã đấu giá
          </Button>
          <li className={cx("name")}>
            <p>Xin chào: {name}</p>
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
            onClick={handleSignOut}
          >
            Đăng xuất
          </Button>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
