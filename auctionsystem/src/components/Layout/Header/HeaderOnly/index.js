import classNames from "classnames/bind";
import styles from "./HeaderOnly.module.scss";
// import logo from "~/assets/logo-1@2x - Copy.png";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";

const cx = classNames.bind(styles);

function Header() {
  const navigate = useNavigate();

  return (
    <header className={cx("wrapper")} style={{ background: "#01579b" }}>
      <nav className={cx("inner-header")}>
        <ul>
          {/* <li className={cx("logo")}>
            <img src={logo} alt="MagicPost" />
          </li> */}
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
