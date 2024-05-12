import classNames from "classnames/bind";
import styles from "./HeaderOnly.module.scss";
// import logo from "~/assets/logo-1@2x - Copy.png";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";
import logo from "~/assets/logoDog.jpg"
const cx = classNames.bind(styles);

function Header() {
  const navigate = useNavigate();

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
            onClick={() => {navigate("/")}} 
          >
            Trang chủ
          </Button>
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
            onClick={() => {
              navigate("/login");
            }}
          >
            Đăng nhập
          </Button>
        
        </ul>
      </nav>
    </header>
  );
}

export default Header;
