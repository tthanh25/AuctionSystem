import classNames from "classnames/bind";
import styles from "./Header.module.scss";
// import logo from "~/assets/logo-1@2x - Copy.png";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";

const cx = classNames.bind(styles);

function Header() {
  const navigate = useNavigate();
  const name = localStorage.getItem("username");
  return (
    <header className={cx("wrapper")} style={{ background: "#01579b" }}>
      <nav className={cx("inner-header")}>
        <ul>
          {/* <li className={cx("logo")}>
            <img src={logo} alt="MagicPost" />
          </li> */}
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
              alignItems: "flex-end",
              color: "white",
              "&:hover": {
                backgroundColor: blue[500],
                color: "white",
              },
            }}
            onClick={() => {
              localStorage.clear()
              navigate("/");
            }}
          >
            Đăng xuất
          </Button>
        
        </ul>
      </nav>
    </header>
  );
}

export default Header;
