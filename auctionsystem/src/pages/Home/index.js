import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Divider, ImageList, ImageListItem } from "@mui/material";
import firebaseService from "~/services/firebase";

function Home() {
  const navigate = useNavigate();
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
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
  }, []);

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

  return (
    <div>
      <ImageList cols={3}>
        {itemData.map((item) => (
          <Button key={item.id} onClick={() => handleItemClick(item.id)}>
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
          </Button>
        ))}
      </ImageList>
    </div>
  );
}

export default Home;
