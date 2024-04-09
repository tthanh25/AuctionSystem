import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Divider, ImageList, ImageListItem } from "@mui/material";
import firebaseService from "~/services/firebase";
import Paper from '@mui/material/Paper';

function Home() {
  const navigate = useNavigate();
  const [itemData, setItemData] = useState([]);



  const calculateTimeLeft = (items) => {
    return items.map((item) => {
      const auctionEndTime = item.auctionEnd.toMillis(); // Convert timestamp to milliseconds
      const currentTime = Date.now(); // Get current time in milliseconds
      let timeDiff = Math.max(0, auctionEndTime - currentTime); // Ensure time difference is non-negative
      const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60)); // Calculate remaining hours
      timeDiff -= hoursLeft * (1000 * 60 * 60); // Subtract hours from time difference
      const minutesLeft = Math.floor(timeDiff / (1000 * 60)); // Calculate remaining minutes
      timeDiff -= minutesLeft * (1000 * 60); // Subtract minutes from time difference
      const secondsLeft = Math.floor(timeDiff / 1000); // Calculate remaining seconds
      return { ...item, timeLeft: { hours: hoursLeft, minutes: minutesLeft, seconds: secondsLeft } };
    });
  };

  const handleItemClick = (itemId) => {
    navigate(`/detail/${itemId}`);
  };


  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      // Xử lý khi thời gian chạy ngược đạt 0
      // Ví dụ: Hiển thị thông báo hoặc thực hiện một hành động
      console.log('Countdown finished!');
    }
    const fetchItems = async () => {
      try {
        const items = await firebaseService.getItems();
        const itemsWithTimeLeft = calculateTimeLeft(items);
        setItemData(itemsWithTimeLeft);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, [countdown]);

  return (
    <div style={{marginTop:"99px",marginBottom:"99px"}}>
        <ImageList cols={3}>
          {itemData.map((item) => (
            <Button key={item.id} onClick={() => handleItemClick(item.id)}>
              <Paper elevation={3} sx={{padding:"24px"}}>
                <ImageListItem>
                  <img src={item.imageUrl} alt={item.name} />
                  <p>{item.name}</p>
                  <Divider />
                  <p>{item.currentPrice} $</p>
                  <p>
                    {item.timeLeft.hours} giờ {item.timeLeft.minutes} phút {item.timeLeft.seconds} giây còn lại
                  </p>
                  <Divider />
                </ImageListItem>
              </Paper>
            </Button>
          ))}
        </ImageList>
    </div>
  );
}

export default Home;
