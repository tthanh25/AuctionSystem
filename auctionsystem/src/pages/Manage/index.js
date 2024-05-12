import classNames from "classnames";
import styles from "./Manage.module.scss"
import ManageAccount from "./account";
import ManageOrder from "./order";
import { Button, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { orange } from "@mui/material/colors";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import InventoryIcon from '@mui/icons-material/Inventory';

const cx = classNames.bind(styles)
function Manage() {
  const [isAccountTable, setIsAccountTable] = useState(true);
  const [activeButton, setActiveButton] = useState("account");
  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };
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
              startIcon = {<AccountBoxIcon/>}
              variant="contained"
              sx={{
                
                fontSize: "18px",
                margin: "32px",
                alignItems: "center",
                color: "white",
                backgroundColor: activeButton == "account" ? "#ff6d00" : "#2196f3",
                "&:hover": {
                  backgroundColor: orange[900],
                  color: "white",
                },
              }}
              onClick={() => {
                changeToAccountTable();
                handleButtonClick("account");
              }}
            >
              Tài khoản
        </Button>
        <Button
              size="Large"
              disableFocusRipple
              disableRipple
              variant="contained"
              startIcon={<InventoryIcon/>}
              sx={{
                marginLeft:"48px",
                alignItems: "center",
                color: "white",
                backgroundColor: activeButton == "auction" ? "#ff6d00" : "#2196f3",
                "&:hover": {
                  backgroundColor: orange[900],
                  color: "white",
                },
              }}
              onClick={() => {
                changeToOrderTable();
                handleButtonClick("auction");
              }}
            >
              Đơn đấu giá
        </Button>
      {isAccountTable ? <ManageAccount/> : <ManageOrder/>}
    </Paper>
  );
}

export default Manage;