import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Button, Divider, InputAdornment, Paper, TextField, Alert } from "@mui/material";
import styles from "./Upload.module.scss";
import classNames from "classnames/bind";
import firebaseService from "~/services/firebase";
import { useParams } from "react-router-dom";
import InputFileUpload from "./InputFileUpload";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { orange } from "@mui/material/colors";
import { Timestamp } from "firebase/firestore";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const cx = classNames.bind(styles);

function Detail() {
  const { itemId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: "", severity: "success" });
  const [startDateTime, setStartDateTime] = useState(dayjs(Timestamp.now()));
  const [endDateTime, setEndDateTime] = useState(dayjs(Timestamp.now()));
  const [item, setItem] = useState({
    name: "",
    description: "",
    imageUrl: "",
    auctionStart: Timestamp.now(),
    auctionEnd: Timestamp.now(),
    currentPrice: 0,
    priceIncrement: 0,
  });

  const handleInputChange = (value, name) => {
    setItem({
      ...item,
      [name]: value,
    });
  };

  const handleCloseNotification = () => {
    setNotification({ message: "", severity: "success" });
  };

  const handleToUpload = async () => {
    try {
      // Upload image to Firebase Storage and get the URL
      const imageUrl = await firebaseService.uploadImage(item.imageUrl);

      const auctionStartTimestamp = Timestamp.fromDate(startDateTime.toDate());
      const auctionEndTimestamp = Timestamp.fromDate(endDateTime.toDate());

      // Add item to Firebase
      await firebaseService.addItem({
        ...item,
        imageUrl: imageUrl,
        auctionStart: auctionStartTimestamp,
        auctionEnd: auctionEndTimestamp,
      });

      setNotification({ message: "Item uploaded successfully", severity: "success" });
    } catch (error) {
      console.error("Error adding item:", error);
      setNotification({ message: "Error uploading item", severity: "error" });
    }
  };

  return (
    <div style={{ marginBottom: "99px", marginTop: "99px" }}>
      <Paper className={cx("paper")} elevation={3}>
        <div className={cx("content")}>
          <h2 className={cx("name")}>
            <label
              style={{
                marginTop: "36px",
                fontSize: "18px",
                paddingLeft: "24px",
                fontWeight: "bold",
                display: "flex",
                lineHeight: "48px",
              }}
            >
              Nhập tên:
            </label>
            <TextField
              fullWidth
              id="outlined-start-adornment"
              sx={{ m: 1 }}
              value={item.name}
              onChange={(e) => {
                handleInputChange(e.target.value, "name");
              }}
            />
          </h2>
          <Divider style={{ margin: "16px" }} />
          <div className={cx("description")}>
            <label
              style={{
                fontSize: "18px",
                paddingLeft: "24px",
                fontWeight: "bold",
                display: "flex",
                lineHeight: "48px",
              }}
            >
              Nhập mô tả:
            </label>
            <TextField
              id="outlined-start-adornment"
              multiline
              sx={{ m: 1, width: "100%" }}
              value={item.description}
              onChange={(e) => {
                handleInputChange(e.target.value, "description");
              }}
            />
          </div>
          <img src={item.imageUrl} style={{ height: "450px" }}></img>
          <InputFileUpload item={item} setItem={setItem} />
          <Divider style={{ margin: "16px" }} />  
          <div className={cx("payment")}>
            <label
              style={{
                fontSize: "18px",
                paddingLeft: "24px",
                fontWeight: "bold",
                display: "flex",
                lineHeight: "48px",
              }}
            >
              Nhập mức giá:
            </label>
            <TextField
              fullWidth
              type="number"
              id="outlined-start-adornment"
              sx={{ m: 1 }}
              value={item.currentPrice}
              onChange={(e) => {
                handleInputChange(e.target.value, "currentPrice");
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">$</InputAdornment>,
              }}
            />
            <label
              style={{
                fontSize: "18px",
                paddingLeft: "24px",
                fontWeight: "bold",
                display: "flex",
                lineHeight: "48px",
              }}
            >
              Nhập chênh lệch đấu giá:
            </label>
            <TextField
              fullWidth
              type="number"
              id="outlined-start-adornment"
              sx={{ m: 1 }}
              value={item.priceIncrement}
              onChange={(e) => {
                handleInputChange(e.target.value, "priceIncrement");
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">$</InputAdornment>,
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <label
              style={{
                marginTop:"12px",
                fontSize: "18px",
                paddingLeft: "24px",
                fontWeight: "bold",
                display: "flex",
                lineHeight: "48px",
              }}
            >
              Nhập thời gian đấu giá:
            </label>
              <p>
                <DateTimePicker sx={{ m: 1,mr: 12 }} label="Bắt đầu" 
                value={startDateTime}
                onChange={(e) => {setStartDateTime(e); console.log(startDateTime);handleInputChange(startDateTime, 'auctionStart');}}
                /> 
                <DateTimePicker sx={{ m: 1,ml: 12 }} label="Kết thúc " 
                value={endDateTime}
                onChange={(e) => {setEndDateTime(e); console.log(endDateTime);handleInputChange(endDateTime, 'auctionEnd');}}
                />
              </p>
             </LocalizationProvider>
          </div>

          <Button
            size="large"
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
            onClick={handleToUpload}
          >
            Tải lên
          </Button>
          {notification.message && (
            <Alert severity={notification.severity} onClose={handleCloseNotification}>
              {notification.message}
            </Alert>
          )}
        </div>
      </Paper>
    </div>
  );
}

export default Detail;
