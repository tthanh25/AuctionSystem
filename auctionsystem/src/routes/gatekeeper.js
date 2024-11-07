import AdminLayout from "~/components/Layout/Admin";
import CustomerLayout from "~/components/Layout/Customer";
import HeaderOnly from "~/components/Layout/Header";
import firebaseService from "~/services/firebase";
import _ from 'lodash'; 
const handleToUploadGatekeeper = async (setNotification, item) => {
    let role = 3; 
    role = parseInt(localStorage.getItem("role"), 10)
    if (!_.isEqual(role, 1)) {
        setNotification({ message: "Bạn không có quyền", severity: "error" });
        return;
    }
    for (let key in item) {
        if (item[key] === "" || item[key] === null || item[key] < 0) {
            setNotification({ message: "Giá trị không hợp lệ", severity: "error" });
            return;
        }
    }
    try {
        const imageUrl = await firebaseService.uploadImage(item.imageUrl);

        await firebaseService.addItem({
            ...item,
            imageUrl: imageUrl,
        });
        setNotification({ message: "Thêm phiên đấu giá thành công", severity: "success" });
    } catch (error) {
        console.error("Error adding item:", error);
        setNotification({ message: "Thêm phiên đấu giá thất bại", severity: "error" });
    }
};

const handleBidSubmitGatekeeper = async (setNotification,bidAmount,itemId) => {
    let role = 3; 
    role = parseInt(localStorage.getItem("role"), 10)
    if (!_.isEqual(role, 0)) {
      setNotification({ message: "Bạn không có quyền", severity: "error" });
      return;
    }

    if (bidAmount == "" || bidAmount == null || bidAmount < 0) {
      setNotification({message: "Giá trị không hợp lệ", severity:"error"})
      return}
    else
    try {
      const userId = localStorage.getItem("uid");

      if (!userId) {
        throw new Error("Đăng nhập để đấu giá");
      }

      await firebaseService.placeBid(itemId, userId, bidAmount);
      setNotification({ message: "Đấu giá thành công", severity: "success" });

    } catch (error) {
      console.error("Error placing bid:", error);
      setNotification({ message: error.message || "Đấu giá thất bại", severity: "error" });
    }
    
  };


export { handleToUploadGatekeeper, handleBidSubmitGatekeeper };