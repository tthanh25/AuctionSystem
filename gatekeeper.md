# Gatekeeper Pattern
## Bối cảnh và vấn đề
- Các dịch vụ đám mây hiển thị các điểm cuối cho phép ứng dụng khách gọi API của chúng. Mã được sử dụng để triển khai trình kích hoạt API hoặc thực hiện một số tác vụ, bao gồm nhưng không giới hạn ở việc xác thực, ủy quyền, xác thực tham số và xử lý một phần hoặc toàn bộ. Mã API có thể thay mặt khách hàng truy cập vào bộ lưu trữ và các dịch vụ khác. 
- Nếu một người dùng độc hại xâm nhập vào hệ thống và có được quyền truy cập vào môi trường lưu trữ ứng dụng, các cơ chế bảo mật và quyền truy cập vào dữ liệu cũng như các dịch vụ khác sẽ bị lộ. Kết quả là, người dùng độc hại có thể có quyền truy cập không giới hạn vào thông tin xác thực, khóa lưu trữ, thông tin nhạy cảm, và các dịch vụ khác.

## Giải pháp
- Một giải pháp cho vấn đề này là tách mã triển khai các điểm cuối công khai khỏi mã xử lý yêu cầu và truy cập bộ nhớ. Bạn có thể thực hiện việc tách rời bằng cách sử dụng façade(façade pattern phần này chắc đọc thêm để hiểu nhỡ có nhóm hỏi nha) hoặc một tác vụ chuyên dụng tương tác với máy khách và sau đó chuyển giao yêu cầu—có thể thông qua giao diện được tách riêng—đến các máy chủ hoặc tác vụ xử lý yêu cầu đó. Hình này cung cấp một cái nhìn tổng quan cấp cao về mẫu này.
 ![image](https://github.com/user-attachments/assets/b32fb3c9-2731-41ca-906d-a2261267a676)

- Mẫu gatekeeper có thể được sử dụng để bảo vệ lưu trữ hoặc có thể được sử dụng như một façade toàn diện hơn để bảo vệ tất cả các chức năng của ứng dụng. Các yếu tố quan trọng bao gồm:
1.	**Xác Thực Kiểm Soát:** Gatekeeper xác thực tất cả các yêu cầu và từ chối những yêu cầu không đáp ứng yêu cầu xác thực.
2.	**Rủi ro và tiếp xúc hạn chế:** Gatekeeper không có quyền truy cập vào thông tin xác thực hoặc khóa được sử dụng bởi máy chủ tin cậy để truy bộ cập lưu trữ và dịch vụ. Nếu gatekeeper bị xâm nhập, kẻ tấn công sẽ không có quyền truy cập vào những thông tin xác thực hoặc khóa này.
3.	**Bảo Mật Phù Hợp:** Gatekeeper hoạt động trong chế độ quyền hạn giới hạn, trong khi phần còn lại của ứng dụng hoạt động trong chế độ tin cậy đầy đủ cần thiết để truy cập lưu trữ và dịch vụ. Nếu gatekeeper bị xâm nhập, nó không thể truy cập trực tiếp vào các dịch vụ hoặc dữ liệu của ứng dụng.
Mẫu này hoạt động giống như một tường lửa trong một cấu trúc mạng điển hình. Nó cho phép gatekeeper kiểm tra các yêu cầu và quyết định xem có nên chuyển tiếp yêu cầu đó đến máy chủ tin cậy thực hiện các tác vụ cần thiết hay không. Quyết định này thường yêu cầu gatekeeper xác thực và làm sạch nội dung yêu cầu trước khi chuyển tiếp đến máy chủ tin cậy.

## Vấn đề cân nhắc
Xem xét các điểm sau đây khi quyết định cách triển khai mẫu này:
1.	**Bảo Đảm Các Điểm Cuối Tin Cậy:** Đảm bảo rằng các máy chủ tin cậy chỉ mở ra các điểm cuối nội bộ hoặc được bảo vệ, chỉ được sử dụng bởi gatekeeper. Các máy chủ tin cậy không nên mở bất kỳ điểm cuối hoặc giao diện bên ngoài nào.
2.	**Chạy Gatekeeper Trong Chế Độ Quyền Hạn Hạn Chế:** Gatekeeper phải chạy trong chế độ quyền hạn hạn chế, điều này thường yêu cầu chạy gatekeeper và máy chủ tin cậy trong các dịch vụ lưu trữ hoặc máy ảo riêng biệt.
3.	**Không Thực Hiện Xử Lý Liên Quan Đến Ứng Dụng:** Gatekeeper không nên thực hiện bất kỳ xử lý nào liên quan đến ứng dụng hoặc dịch vụ hoặc truy cập bất kỳ dữ liệu nào. Chức năng của nó hoàn toàn là xác thực và làm sạch các yêu cầu. Các máy chủ tin cậy có thể cần thực hiện xác thực yêu cầu bổ sung, nhưng gatekeeper nên thực hiện xác thực cốt lõi.
4.	**Sử Dụng Kênh Giao Tiếp Bảo Mật:** Sử dụng kênh giao tiếp bảo mật (HTTPS, SSL hoặc TLS) giữa gatekeeper và các máy chủ hoặc tác vụ tin cậy khi có thể. Tuy nhiên, một số môi trường lưu trữ không hỗ trợ HTTPS trên các điểm cuối nội bộ.
5.	**Tác Động Đến Hiệu Suất:** Việc thêm lớp bảo vệ để triển khai mẫu gatekeeper có thể ảnh hưởng đến hiệu suất do cần thêm xử lý và giao tiếp mạng.
6.	**Điểm lỗi duy nhất:** Instance gatekeeper có thể trở thành lỗi duy nhất. Để giảm thiểu tác động của sự cố, hãy xem xét triển khai các instance dư thừa và sử dụng cơ chế tự động mở rộng để đảm bảo khả năng duy trì tính khả dụng.

## Khi nào sử dụng Gatekeeper pattern?
Mẫu này hữu ích cho các ứng dụng mà:
1.	**Xử Lý Thông Tin Nhạy Cảm:** Các ứng dụng cần bảo vệ dữ liệu quan trọng và nhạy cảm.
2.	**Mở Rộng Dịch Vụ:** Các dịch vụ yêu cầu mức độ bảo vệ cao khỏi các cuộc tấn công độc hại.
3.	**Thực Hiện Các Hoạt Động Quan Trọng:** Các hoạt động quan trọng không thể bị gián đoạn.
4.	**Yêu Cầu Xác Thực và Yêu Cầu chính Tách Biệt:** Các ứng dụng yêu cầu xác thực yêu cầu được thực hiện riêng biệt khỏi các tác vụ chính, hoặc để tập trung hóa xác thực này nhằm đơn giản hóa việc bảo trì và quản lý.
## Ví dụ
- Trong một kịch bản được lưu trữ trên đám mây, mẫu này có thể được triển khai bằng cách tách rời vai trò gatekeeper hoặc máy ảo khỏi các vai trò và dịch vụ tin cậy trong một ứng dụng. Việc triển khai có thể sử dụng một điểm cuối nội bộ, hàng đợi, hoặc lưu trữ như một cơ chế giao tiếp trung gian.
![image](https://github.com/user-attachments/assets/fc4bdef5-0e92-4dd3-a0b9-ae366df81c26)

## Mở rộng
Mẫu **Valet Key** cũng có thể liên quan khi triển khai mẫu Gatekeeper. Khi giao tiếp giữa Gatekeeper và các vai trò tin cậy, việc tăng cường bảo mật bằng cách sử dụng các khóa hoặc mã thông báo hạn chế quyền truy cập vào tài nguyên là một thực tiễn tốt.

Mô Tả Mẫu **Valet Key**:

  •	**Khóa hoặc Mã Thông Báo:** Mẫu này mô tả việc sử dụng một mã thông báo hoặc khóa cung cấp cho khách hàng quyền truy cập trực tiếp hạn chế vào một tài nguyên hoặc dịch vụ cụ thể.
  
  •	**Bảo Mật Tăng Cường:** Việc sử dụng khóa hoặc mã thông báo giúp đảm bảo rằng ngay cả khi có sự cố bảo mật, quyền truy cập vào các tài nguyên nhạy cảm vẫn được kiểm soát chặt chẽ.
  
Khi kết hợp mẫu Gatekeeper với mẫu **Valet Key**, bạn có thể tạo ra một kiến trúc bảo mật mạnh mẽ hơn, giúp hạn chế quyền truy cập và bảo vệ các dịch vụ và tài nguyên trong ứng dụng của bạn.


