import { useEffect, useState } from "react";
import { Button, Divider, InputAdornment, Paper, TextField, Alert, Fade, AlertTitle } from "@mui/material";
import styles from "./Detail.module.scss";
import classNames from "classnames/bind";
import firebaseService from "~/services/firebase";
import { useParams } from "react-router-dom";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
const cx = classNames.bind(styles);

function Detail() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [notification, setNotification] = useState({ message: "", severity: "success" });

  useEffect(() => {
    fetch();
  }, [itemId]);
  const fetch = async () => {
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
  }
  const handleBidAmountChange = (event) => {
    var number = parseInt(event.target.value, 10);
    setBidAmount(number);
  };

  const handleBidSubmit = async () => {
    if (bidAmount == "" || bidAmount == null || bidAmount < 0) {
      setNotification({message: "Giá trị không hợp lệ", severity:"error"})
      return}
    else
    try {
      // Retrieve user ID from local storage
      const userId = localStorage.getItem("uid");

      // Check if userId is null or empty
      if (!userId) {
        throw new Error("Đăng nhập để đấu giá");
      }

      // Place the bid using the retrieved user ID
      await firebaseService.placeBid(itemId, userId, bidAmount);
      setNotification({ message: "Đấu giá thành công", severity: "success" });
      // Optionally, you can fetch updated item data after placing the bid
      // const updatedItem = await firebaseService.getItemById(itemId);
      // setItem(updatedItem);
      fetch();
    } catch (error) {
      console.error("Error placing bid:", error);
      setNotification({ message: error.message || "Đấu giá thất bại", severity: "error" });
      // Handle error
    }
  };



  const handleCloseNotification = () => {
    setNotification({ message: "", severity: "success" });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={{ marginTop: "99px", marginBottom: "99px" }}>
      <Paper className={cx("paper")} elevation={3}>
        <div className={cx("content")}>
          <h2 className={cx("name")}>{item.name}</h2>
          <Divider style={{ margin: "16px" }} />
          <div className={cx("description")}>
            <p>{item.description}</p>
          </div>
          <img src={item.imageUrl} alt={item.name} style={{ height: "450px" }}></img>
          <Divider style={{ margin: "16px" }} />
          <div className={cx("payment")}>
            <TextField
              fullWidth
              type="number"
              label="Nhập mức đấu giá"
              id="outlined-start-adornment"
              sx={{ m: 1 }}
              value={bidAmount}
              onChange={handleBidAmountChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">$</InputAdornment>,
              }}
            />
            <p>
              Giá hiện tại: {item.currentPrice} $
              <br />
              Mức chênh lệch đấu giá (Bước giá): {item.priceIncrement} $
            </p>
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
                  readOnly
                  value={dayjs(item.auctionStart.toDate())}
                  renderInput={(props) => <TextField {...props} />}
                />
                <DateTimePicker
                  sx={{ m: 1, ml: 12 }}
                  label="Kết thúc"
                  readOnly
                  value={dayjs(item.auctionEnd.toDate())}
                  renderInput={(props) => <TextField {...props} />}
                />
              </p>
            </LocalizationProvider>
          </div>
          <Button variant="contained" onClick={handleBidSubmit}>
            Xác nhận đấu giá
          </Button>
          {notification.message && (
            <Fade in = {notification.message} timeout={500}>
            <Alert severity={notification.severity} onClose={handleCloseNotification}
            variant="filled"
            sx={{
              position: "fixed",
              fontSize: "1.0rem",
              left: "48px",
              bottom: "48px",
              zIndex: 100,
              width: "45%",
            }}>
          
              <AlertTitle sx={{ fontSize: "1.2rem", fontWeight: "Bold" }}>{notification.severity == "success" ? ("Thành công") : ("Lỗi")}</AlertTitle>
              {notification.message}
            </Alert>
         </Fade>
          )}
        </div>
      </Paper>
    </div>
  );
}

export default Detail;
