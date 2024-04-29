import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button, Divider, InputAdornment, Paper, TextField, Alert } from "@mui/material";
import styles from "./Update.module.scss";
import classNames from "classnames/bind";
import firebaseService from "~/services/firebase";
import { useParams } from "react-router-dom";
import InputFileUpload from "./InputFileUpload";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { orange } from "@mui/material/colors";
import { Timestamp } from "firebase/firestore";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const cx = classNames.bind(styles);

function Update() {
  const { itemId } = useParams();
  const [item, setItem] = useState({
    name: "",
    description: "",
    imageUrl: "",
    auctionStart: Timestamp.now(),
    auctionEnd: Timestamp.now(), 
    currentPrice: 0,
    priceIncrement: 0,
  });
  useEffect(() => {
    firebaseService
      .getItemById(itemId)
      .then((itemData) => {
        setItem(itemData);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [itemId]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: "", severity: "success" });

  const handleInputChange = (value, name) => {
    setItem({
      ...item,
      [name]: value,
    });
  };

  const handleCloseNotification = () => {
    setNotification({ message: "", severity: "success" });
  };

  const handleToUpdate = async () => {
    try {
      // Update item in Firebase
      await firebaseService.updateItem(itemId, item);

      setNotification({ message: "Item updated successfully", severity: "success" });
    } catch (error) {
      console.error("Error updating item:", error);
      setNotification({ message: "Error updating item", severity: "error" });
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
              Tên:
            </label>
            <TextField
              fullWidth
              id="outlined-start-adornment"
              sx={{ m: 1 }}
              defaultValue={item.name}
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
              Mô tả:
            </label>
            <TextField
              id="outlined-start-adornment"
              multiline
              sx={{ m: 1, width: "100%" }}
              defaultValue={item.description}
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
              Mức giá:
            </label>
            <TextField
              fullWidth
              type="number"
              id="outlined-start-adornment"
              sx={{ m: 1 }}
              defaultValue={item.currentPrice}
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
              Chênh lệch đấu giá:
            </label>
            <TextField
              fullWidth
              type="number"
              id="outlined-start-adornment"
              sx={{ m: 1 }}
              defaultValue={item.priceIncrement}
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
                  marginTop: "12px",
                  fontSize: "18px",
                  paddingLeft: "24px",
                  fontWeight: "bold",
                  display: "flex",
                  lineHeight: "48px",
                }}
              >
                Thời gian đấu giá:
              </label>
              <p>
                <DateTimePicker
                  sx={{ m: 1, mr: 12 }}
                  label="Bắt đầu"
                  value={dayjs(item.auctionStart.toDate())}
                  onChange={(date) => handleInputChange(Timestamp.fromDate(date.toDate()), "auctionStart")}
                  renderInput={(props) => <TextField {...props} />}
                />
                <DateTimePicker
                  sx={{ m: 1, ml: 12 }}
                  label="Kết thúc"
                  value={dayjs(item.auctionEnd.toDate())}
                  onChange={(date) => handleInputChange(Timestamp.fromDate(date.toDate()), "auctionEnd")}
                  renderInput={(props) => <TextField {...props} />}
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
            onClick={handleToUpdate}
          >
            Cập nhật
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

export default Update;
