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

Mô hình cơ sở dữ liệu sử dụng trong xác thực người dùng là bức tường cuối cùng ngăn chặn người dùng truy cập trái phép khi các phương pháp 
khác thất bại. Bạn phải thiết kế lược đồ cơ sở dũ liệu để trong trường hợp xấu nhất, nó bị kẻ xấu xâm nhập. Mật khẩu lưu dưới dạng hash sẽ ngăn chặn việc tiết lộ mật khẩu.

Bạn nghĩ rằng việc lưu trữ password dưới dạng encryted là đã đủ bảo mật?. Nhưng bạn nên nhớ rằng hàm encryption luôn tồn tại một hàm decryption. Bằng cách sử dụng decription, kẻ xấu có thể lấy được mật khẩu của người dùng. Chính vì vậy password không được lưu ở cơ sơ dữ liệu dưới dạng encrypted. Nó phải được băm ra theo phương thức 1 chiều.

Hàm hashing, không giống như hàm encryption. Nó chỉ có một chiều duy nhất, đó là mã hóa. Bạn nghĩ là nó không có tác dụng khi không thể giải mã? Nhưng chúng ta cần giải mã làm gì trong khi có thể sử dụng chuỗi mã hóa đó để so sánh (Chuỗi mã hóa được lưu trong cơ sở dũ liệu, khi người dùng yêu cầu đăng nhập, họ cung cấp mật khẩu, mật khẩu sau đó được chương trình máy tính mã hóa và so sánh với chuỗi mã hóa đã tồn tại trước đó). Flowchart bên dưới sẽ minh họa một cách tường minh cơ chế hoạt động:

======================== Ảnh =============================

Mã băm của mật khẩu được người dùng cung cấp sẽ được so sánh với mã băm đã chứa trong bảng người dùng bằng cách tìm kiếm theo tên người dùng.

Có rất nhiều thuật toán để băm với các cấp độ bảo mật tương ứng. Phổ biến nhất là [SHA-2]() và  [SHA-3](). Mô hình dữ liệu phục vụ cho xác 
thực người dùng có thể sử dụng các thuật toán băm một cách linh hoạt
(nếu phát hiện thuật toán cũ có lỗ hổng bảo mật, bạn có thể chuyển đổi sang thuật toán mới). Khi thiết kế mô hình xác thực người dùng, hãy thêm một trường để xác định xem bạn đang dùng thuật toán gì để băm mật khẩu.

## Thêm Salt vào Passwords

Khi băm mật khẩu, việc thêm salt vào hàm băm được rút ra từ nhiều trường hợp. Một salt là một chuỗi ngẫu nhiên tạo ra khi password được 
đặt bởi người dùng. Nó phải được chứa trong authentication data table
bên cạnh password hash. Chuỗi này là ngẫu nhiên, duy nhất và cố định đối với một người dùng khi đặt password (có thể thay đổi khi người dùng đặt lại password). Nhờ có nó mà khi tồn tại các người dùng trùng mật khẩu thì chuỗi được băm ra vẫn khác nhau, từ đó nâng cao tính bảo mật.

## Đặt tên bảng dữ liệu phù hợp.

Tới đây, bạn đã biết các trường mà một basis authentication data table phải có. Bây giờ, bạn cần đặt tên cho nó. Với các bảng có thông tin nhạy cảm, việc đặt tên bảng một cách dễ đoán thường tạo điều kiện dễ dàng cho kẻ xấu thực hiện [SQL INJECTION ATTACKS](). Do đó, việc đặt tên các tabel với các tiền tố khó đoán là cần thiết, chẳng hạn như `tediou_user` hoặc `banana_user` 😎

## Chọn Primary Key phù hợp

Một khi bạn đã biết các trường có trong table authentication data. Bạn cần phải chọn ra một trường làm primary key.

Login name là duy nhất và không thể lặp lại giữa các người dùng, theo lý thuyết thì nó thích hợp để làm primary key. Tuy nhiên (sẽ làm rõ bên dưới), để nâng cao trải nghiệm người dùng, chúng ta cần cung cấp cho họ khả năng thay đổi login name, vì vậy, việc đặt trường này làm primary key sẽ không còn khả thi.

Lý tưởng hơn, các primary key thường được tự sinh ra và là một trường trừu tượng của ứng dụng. 

Oke, sau những kiến thức đã tiết lộ, giờ đây bạn đã có thể thiết kế được một authentication system database tối thiểu, bao gồm một bảng người dùng khi đặt vào ngữ cảnh đăng nhập với login name, password hash, và các salt sử dụng cho hashing algorithm. Bảng này cũng phải chứa ID của hashing algorithms sẽ được sử dụng cho từng user, nó sử dụng để lookup trong bảng hashing algorithms.

=========== Ảnh =============

## Xác thực địa chỉ email

Thông thường, việc xác thực email sẽ là phương thức bảo mật thứ 2 người dùng phải thực hiện sau khi nhập password. Để làm điểu này, bạn cần phải thiết kế một mô hình xác thực để xác minh địa chỉ email hợp lệ.

Cách thức để triển khai việc xác thực này là qua một chuỗi token (nó có tính random và unique) đủ dài để thông thể đoán được thông qua brute force.
Module được thiết kế sẽ phải gửi token này tới địa chỉ email đã được đăng ký, đính kèm trong đường dẫn tới trang xác thực của ứng dụng. Người dùng phải truy cập vào đường dẫn đó để ứng dụng có thể xác nhận địa chỉ email.

Một khi ứng dụng nhận ra người dùng truy cập trang xác thực với token kèm theo, ứng dụng sẽ trích xuất token và tìm kiếm sự tồn tại của token trong cơ sở dữ liệu lưu trữ. Nếu phát hiện ra dữ liệu người dùng chứa chuỗi token này, ứng dụng sẽ đánh dấu rằng email này đã được liên kết với tài khoản đăng nhập một cách hợp lệ.

Làm sao để chúng ta có thể định nghĩa một data model cho cơ chế này? Chúng ta có thể sử dụng thiết kế tối thiểu trước đó và thêm vào các phần tử.

Để bắt đầu, chúng ta cần thêm trường email address vào bảng dữ liệu, bên cạnh đó là confirmation token. Còn một trường dữ liệu quan trọng không kém đó là timestamps tại thời điểm token được tạo ra tới lúc token hết hạn. Bên cạnh đó chúng ta cần một trường để lưu lại trạng thái xác thực của email, nó là một foreign key của bảng status. Với các phần tử được thêm vào, giờ đây bản thiết kế cơ sở dữ liệu của chúng ta sẽ trông như thế này:

================ ảnh ==============

Trường confirmation token phải chấp nhận giá trị null bởi vì nó sẽ bị xóa khi địa chỉ email được xác nhận.

## Lấy lại mật khẩu

Bất kỳ hệ thống xác thực người dùng thực tế nào đều cung cấp cho người dùng lựa chọn lấy lại mật khẩu khi quên mật khẩu. Cách tốt nhất là cung cấp một đường dẫn tại trang đăng nhập để quản lý việc quên mật khẩu.

Nó được thực hiện bằng các yêu cầu user ID (thông thường là username hoặc email adddress), xác nhận user ID có liên kết với một tài khoản đang hoạt động, và gửi emai với một token ngẫu nhiên tới email đã được liên kết trước đó.

Recovery token phải có thời gian hết hạn ngắn bởi token này tiềm ẩn nguy cơ rò rỉ bảo mật đối với người dùng. Để có thể triển khai cơ chế này, chúng ta phải thêm hơn hai trường vào authentication data table: một là recovery token và cái nữa là timestamp tương tự như timestams xác nhận email, sau một khoảng thời gian, nó sẽ bị xóa. 

Nếu chúng ta xây dựng một lược đồ phục vụ email confirmation, chúng ta đã có một bảng lưu trữ địa chỉ email. Chúng ta có thể sử dụng email này để gửi mail đặt lại mật khẩu.

Với các trường được thêm vào, bản thiết kế của chúng ta sẽ như thế này:

================== Ảnh ==================

## Xác thực qua External Providers

Sử dụng các dịch vụ external cho việc xác thực ngày càng phổ biến bởi người dùng **không giỏi** trong việc sử dụng mật khẩu, việc sử dụng các dịch vụ phổ biến như google hay apple mang đến trải nghiệm không ngắt quãng cho người dùng.

================== Ảnh ==================

Nếu người dùng chọn xác thực qua các external provider, chúng ta không cần phải lưu lại các thông tin phía trên phục vụ cho xác thực qua mật khẩu. Điều đó có nghĩa là các trường liên quan phải cho phép giá trị null. Trong trường hợp bạn chỉ dùng các phương thức xác thực qua external provider, bạn cần loại bỏ các trường trên. Tuy nhiêu, nếu các dịch vụ external provider chỉ là sự lựa chọn thêm cho người dùng, cân nhắc sử dụng cả hai cách thức.

Các dịch vụ sử dụng một phương thức được gọi là OAuth (Open Authorization). Nó cung cấp một unique token cho phép nhận biết tài khoản có trong dịch vụ xác thực là điều duy nhất mà chúng ta cần để xác nhận người dùng. Tóm gọn lại, cơ chế sẽ như sau: 
1. Người dùng nhấp vào đường dẫn đăng nhập tương ứng với dịch vụ đăng nhập do bên thứ ba cung cấp.
2. Ứng dụng chuyển hướng người dùng tới trang thông tin xác thực của dịch vụ đăng nhập đã chọn.
3. Dịch vụ đăng nhập xác minh người dùng với các thông tin đăng nhập, nếu hợp lệ, trả về một token cho ứng dụng gốc.
4. Ứng dụng tìm xem identification token đã được lưu trữ hay chưa, nếu tìm thấy, hệ thống sẽ lấy ra user account ID và kích hoạt các lựa chọn bởi hồ sơ liên kết (xem bên dưới để xem các lựa chọn được nhận biết cho từng người dùng)

Bản thảo thiết kế dữ liệu đã được bổ sung thêm hai trường vào bảng chính và thêm một bảng lưu trữ các external provider.


================== Ảnh ==================

Khi thêm các trường tham chiếu tới external provider, quản lý mật khẩu là không cần thiết nữa. Các trường liên quan đển mật khẩu không còn là bắt buộc, trường `ExternalProviderId` tham chiếu tới một hạng mục trong bảng `external_providers`. Trong khi trường `ExternalProviderToken` chứa một identifier liên kết với một user của dịch vụ authetication.

Các trường khác có thể được thêm vào bảng, ví dụ như link logo của authenticate.

## User Identity Và User Account.

Các unique usename, phone numbers, email address được coi là các trường để xác định người dùng. Tuy nhiên, chúng ta không muốn các trường trên trở nên unique và là idetifier. Các thông tin creadetial được cho phép thay đổi mà không làm thay đổi personally identifiable information (PII) của user's account.

PII là một tập hợp các dữ liệu chứa trực tiếp identifiers (chẳng hạn một mật khẩu) thuộc về một người duy nhất hoặc có thể chung với nhiều người(e.g. quốc tịch, giới tính, ngày sinh) được kết hợp lại để xác minh một cá nhân.

Cách tốt nhất trong quá trình thiết kế một module authentication là dữ cho các ý tưởng về tài khoản người dùng và user identities tách biệt. Sự tách biệt này cho phép những người dùng liên kết các yếu tố trong một tài khoản người dùng và có thể thay đổi các yếu tố này khi cần.

Khi áp dụng phương án này vào mô hình dữ liệu, chúng ta sẽ phải có các bảng dữ liệu chứa PII tách biệt với dữ liệu xác thực người dùng.


================= Ảnh ==================

Tách biệt user ID và user account entities mang lại khả năng cụ thể cho từng phương pháp đăng nhập.


## Multi-Factor Authentication

Tách biệt concepts của user identity và user account là một bước quan trọng trong việc triển khai hệ thống multi-factor authentication (MFA).

MFA là một cách tốt khác để mở rộng một user authentication system. Nó dựa trên việc sử dụng song song các vadidation element (factors) của các
loại khác nhau. Ví dụ, nó có thể là một mảnh nhỏ thông tin mà người dùng biết (một mật khẩu, một tập hợp các thông tin cá nhân chẳng hạn như quôc tịch, năm sinh, ect.)
sử dụng song song với các yếu tố vật lý thuộc về người dùng (điện thoại, máy tính, vv.v).

Mỗi phương thức đều yêu cầu dữ liệu lưu tại bảng người dùng để xác thực lại thông tin mà người dùng cung cấp.

## Gắn Roles và Permissions

Khía cạnh cuối cùng trong thiết kế user authentication bám sát theo các cách tốt nhất cho một mô hình dữ liệu mạnh mẽ và đa năng cần cung cấp cho người dùng khả năng cấp role 
và permission cho từng người dùng.

Để làm điều này, bạn cần thêm ba bảng vào lược đồ: bảng role, bảng permission, và table chứa liên kết giữa role và permission, ví dụ về role có thể như sau: 
+ Guest - Khách mời
+ Customer - Khách hàng
+ Moderator - Người điều hành
+ Adminitrator - Quản trị viên

Và permission có thể là

+ CanCreateTransaction
+ CanDeleteTransaction
+ CanUpdateTransaction
+ CanReadTransaction

Các permissions và roles tables có liên quan mật thiết với nhau thông qua một table thứ ba là tập hợp của các permission được gắn vào từng role.

Sau khi thêm ba bảng này vào lược đồ, bạn phải có phương thức để gán các role vào từng người dùng. Giả sử rằng người dùng chỉ có một role, bạn cần thêm 
một trường để xác định xem người dùng đang có role nào để thực hiện các chức năng trong ứng dụng.

Với các thông tin bổ sung, mô hình của chúng ta sẽ trông như sau: 


================== Ảnh ==================

## Ghi nhớ đặc biệt

Chúng ta đã học được cách thiết kế một authentication module bằng cách lắp ráp, ghép, xây dựng các table trong xuyên suốt bài viết này. Chỉ có một 
điều mà tôi muốn bạn cần chú ý.

Thông thường, các mô hình lược đồ khác trong hệ thống không nên có khoá ngoại trỏ thằng vào authentication module ngoại trừ user ID. Điều này hỗ trợ 
khi bạn muốn chuyển đổi, sao chép authentication module và phần còn lại sang ứng dụng khác một cách dễ dàng. Ví dụ, khi có một bảng orders, bạn không nên 
lưu các thông tin như địa chỉ nhà riêng, địa chỉ email riêng biệt mà lên lưu nó lại trong authentication module và sử dụng user ID để tham chiếu tới.

Điều này có thể đạt được bằng cách chuẩn hoá, ngoài ra, còn giải quyết được [MOST COMMON DATABASE DESIGN ERRORS](). Bạn cần phải lưu ý điều này vì bạn có thể vô tình tạo ra lỗ hổng bảo mật dữ 
liệu người dùng. 












