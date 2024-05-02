import classNames from "classnames";
import styles from "./Manage.module.scss"
import ManageAccount from "./account";
import ManageOrder from "./order";
import { Button, Paper } from "@mui/material";
import { useState } from "react";
import { orange } from "@mui/material/colors";
const cx = classNames.bind(styles)
function Manage() {
  const [isAccountTable, setIsAccountTable] = useState(true);
  const changeToAccountTable = () => {
    setIsAccountTable(true);
  }
  const changeToOrderTable = () => {
    setIsAccountTable(false);
  }
  return (  
    <Paper sx={{marginTop:"99px", marginBottom:"99px"}} elevation={0}>
      <Button
              size="Large"
              disableFocusRipple
              disableRipple
              sx={{
                alignItems: "flex-end",
                color: "white",
                backgroundColor: "#ff6d00",
                "&:hover": {
                  backgroundColor: orange[900],
                  color: "white",
                },
              }}
              onClick={() => {
                changeToAccountTable();
              }}
            >
              Tài khoản
        </Button>
        <Button
              size="Large"
              disableFocusRipple
              disableRipple
              sx={{
                marginLeft:"48px",
                alignItems: "flex-end",
                color: "white",
                backgroundColor: "#ff6d00",
                "&:hover": {
                  backgroundColor: orange[900],
                  color: "white",
                },
              }}
              onClick={() => {
                changeToOrderTable();
              }}
            >
              Đơn đấu giá
        </Button>
      {isAccountTable ? <ManageAccount/> : <ManageOrder/>}
    </Paper>
  );
}

export default Manage;