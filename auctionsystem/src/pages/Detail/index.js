import { useEffect, useState } from "react";
import { Button, Divider, InputAdornment, Paper, TextField, Alert } from "@mui/material";
import styles from "./Detail.module.scss";
import classNames from "classnames/bind";
import firebaseService from "~/services/firebase";
import { useParams } from "react-router-dom";
const cx = classNames.bind(styles);

function Detail() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [notification, setNotification] = useState({ message: "", severity: "success" });

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

  const handleBidAmountChange = (event) => {
    setBidAmount(event.target.value);
  };

  const handleBidSubmit = async () => {
    try {
      // Retrieve user ID from local storage
      const userId = localStorage.getItem("uid");

      // Check if userId is null or empty
      if (!userId) {
        throw new Error("Đăng nhập để đấu giá");
      }

      // Place the bid using the retrieved user ID
      await firebaseService.placeBid(itemId, userId, bidAmount);
      setNotification({ message: "Bid placed successfully", severity: "success" });
      // Optionally, you can fetch updated item data after placing the bid
      // const updatedItem = await firebaseService.getItemById(itemId);
      // setItem(updatedItem);
    } catch (error) {
      console.error("Error placing bid:", error);
      setNotification({ message: error.message || "Failed to place bid", severity: "error" });
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
              Giá hiện tại: {item.currentPrice}$
              <br />
              Mức chênh lệch đấu giá: {bidAmount - item.currentPrice}$
            </p>
          </div>
          <Button variant="contained" onClick={handleBidSubmit}>
            Xác nhận đấu giá
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
