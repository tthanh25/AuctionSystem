import classNames from "classnames/bind";
import styles from "./Header.module.scss";
// import logo from "~/assets/logo-1@2x - Copy.png";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";

const cx = classNames.bind(styles);

function Header() {
  const navigate = useNavigate();

  return (
    <header className={cx("wrapper")} style={{ background: "#80deea" }}>
      <nav className={cx("inner-header")}>
        <ul>
          {/* <li className={cx("logo")}>
            <img src={logo} alt="MagicPost" />
          </li> */}
          <Button
            disableFocusRipple
            disableRipple
            component="li"
            className={cx("login")}
            sx={{
              color: "black",
              position: "fixed", top: "6px", right: "12px",
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
