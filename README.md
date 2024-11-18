# Auction System 
- React & Firebase
  
# Hệ thống đấu giá chó nhằm mục đích tìm nhà mới cho các chú chó, đồng thời gây quỹ từ thiện xã hội.
- Hệ thống đấu giá cung cấp cơ hội cho những chú chó cần nhà mới và tình yêu của gia đình. 
- Những con chó từ các trại cứu hộ hoặc chó cần tìm nhà mới vì nhiều lý do như gia đình không thể chăm sóc được nữa đều có cơ hội tìm được người chủ mới qua đấu giá.
- Ngoài ra, với mỗi phiên đấu giá thành công sẽ được dùng để duy trì hệ thống đấu giá.
- Phần còn lại sẽ được dùng để gây quỹ từ thiện cho cộng đồng xã hội như các hoạt động nhân đạo, y tế, giáo dục, xã hội và môi trường
  
## Các bước cài đặt:
1. Clone repository về:
  ```
  git clone https://github.com/tthanh25/auctionsystem
  ```
2. Chuyển về thư mục auctionsystem:
  ```
  cd auctionsystem
  ```
3. Tải các dependencies:
  ```
  npm install
  ```
4. Chạy app với câu lệnh:
  ```
  npm start
  ```

## Demo
```
            Request                 Validated Request                 Data
Frontend <----------> Gatekeeper <---------------------> Firebase <----------> Database

```
1. Khi chưa đăng nhập thì không có quyền đấu giá, mà chỉ có quyền xem phiên đầu giá. Bạn phải đăng ký tài khoản để đấu giá.
2. Customer có quyền truy cập vào các địa chỉ như:
  ```
  /customer
  /payment
  /transaction
  /detail/
  ```
3. Admin có quyền truy cập vào các địa chỉ như:
  ```
  /admin
  /upload
  /manage
  /update/
  ```
4. Khi thực hiện các chức năng sẽ kiểm tra với các quyền tương ứng:
   - Đấu giá chỉ dành cho Customer
   - Tải lên phiên đấu giá chỉ dành cho Admin
   - Chỉnh sửa phiên đấu giá chỉ dành cho Admin
   - Xóa tài khoản/ phiên đấu giá chỉ dành cho Admin
...
5. Các dữ liệu trong request sẽ được kiểm tra hợp lệ hay không: đăng nhập, đăng ký, đấu giá, xóa các phiên đấu giá, chỉnh sửa các phiên đấu giá, xóa tài khoản,...
