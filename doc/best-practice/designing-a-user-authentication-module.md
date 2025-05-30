# Kinh nghiệm thiết kế một module xác thực người dùng

Tác giả: Gustavo du Mortier

Gustavo du Mortier là một nhà phân tích chức năng và dữ liệu tại MasterSoft, một công ty phần mềm của Argentina chuyên về các giải pháp ERP và chăm sóc sức khoẻ. Ông đã viết rất nhiều sách và bài báo về 
các khía cạnh khác nhau của lập trình và cơ sở dữ liệu. Trong thời gian rảnh, ông thường chơi guitar
và giúp hai con trai xây dựng và nâng cấp máy tính chơi game của họ.

Chuyên mục: Authentication

Với những kỹ thuật thiết kế cơ sở dũ liệu được chia sẻ dưới đây, việc thiết kế một mô hình dữ liệu xác thực người dùng sử dụng trong hệ thống xác thực người dùng trở nên dễ hiểu hơn bao giờ hết.


Bản thiết kế của ứng dụng cần phải chỉ rõ cơ chế để ngăn không cho những người chưa được uỷ quyền truy cập. Các cơ chế này thường được xây dựng gọn trong một module xác thực. Điều đó giống như việc xây dựng một ngôi nhà có an ninh, ngăn chặn kẻ đột nhập bên cạch các chức năng khác của nó.

Một bản thiết kế của một ngôi nhà quy định và hướng dẫn xem những gì có thể và không thể làm trong từng căn phòng trong ngôi nhà (chẳng hạn, bạn không thể đỗ xe trong phòng ngủ được).
Tương tự, một mô hình dữ liệu định nghĩa các ràng buộc và các chỉ dẫn cho từng bảng dữ liệu, dữ liệu và ứng dụng hoạt động dựa trên chúng. Điều đó có nghĩa là, một mô hình dữ liệu là 
một bản thiết kế mô tả cấu trúc bên trong và mối quan hệ của cơ sở dữ liệu.

Mục đính của mô hình dữ liệu là để minh hoạ cách mà các đối tượng trong cơ sở dữ liệu tương tác với nhau để đáp ứng business logic. [MÔ HÌNH DỮ LIỆU LÀ SỰ THỂ HIỆN TRỪU TƯỢNG CỦA ĐỐI TƯỢNG DỮ LIỆU]() và sự tương tác của chúng trong một mô hình. Lợi ích của nó bao gồm việc sao chép cơ sở dữ liệu và cấu trúc của chúng.

## Xác thực người dùng - User Authentication

User authentication là một lớp hạn chế, ngăn chặn người dùng truy cập ứng dụng. Thông qua authentication, ứng dụng của chúng ta có thể xác định được danh tính của người đang cố gắng đăng ký hoặc đã có quyền hạn truy cập và sử dụng ứng dụng.

Để thiết kế một mô hình xác thực, bạn cần một lược đồ cơ sở dữ liệu. Chúng ta sẽ tìm hiểu cách tốt nhất để thiết kế một lược đồ cơ sở dữ liệu linh hoạt và phung hợp với hầu hết các mô hình xác thực. Hãy bắt đầu bằng việc xem yêu cầu của chúng ta là gì.

## Yêu cầu của mọi mô hình xác thực người dùng

Để có thể ngăn chặn các nỗ lực truy cập chưa được uỷ quyền, một mô hình xác thực người dùng phải cung cấp các khả năng sau (được coi là các chức năng của ứng dụng):

+ Đăng ký người dùng mới.
+ Gửi email xác nhận.
+ Cung cấp phương thức lấy lại mật khẩu.
+ Bảo vệ dữ liệu xác thực từ các truy cập không được uỷ quyền
+ Hỗ trợ xác thực thông qua dịch vụ bên thứ ba.
+ Định nghĩa vai trò và các quyền theo từng vai trò.

Hãy cố gắng không bỏ sót phần nào bắt đầu từ mô hình xác thực tối giản nhất tới mô hình đầy đủ có tất cả các chức năng cần thiết. Bạn có thể xem các mô tả chi tiết của các kỹ thuật để
xây dựng các mô hình có thể giải quyết các yêu cầu trên trong các bài viết sau: [Cách để chứa dữ liệu xác thực trong cơ sở dữ liệu, phần một](), [Xác thực địa chỉ email và lấy lại mật khẩu](), [Đăng nhập băng các dịch vụ bên thứ ba]()

## Xây dựng mô hình cơ sở dữ liệu để xác thực người dùng

Việc thiết kế một mô hình xác thực cần có một bảng chứa thông tin cho việc xác nhận từng người dùng đăng nhập. Tối thiểu, nó phải chứa username và password (password phải được băm mã hoá).

Khi lưu dữ liệu, việc băm mật khẩu ra thành mã hoá thay vì lưu trực tiếp mật khẩu là điều tiên quyết khi xây dựng mô hình
xác thực người dùng, hãy cùng tìm hiểu xem tại sao.

## Lưu trữ Password Hashes thay vì Passwords

Một mô hình cơ sở dữ liệu 







