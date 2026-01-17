# Xử lý thời gian thực - Websocket
Hầu hết các khái niệm được để cập ở đâu đó trong tài liệu chính thức của Nestjs, chẳng hạn như dependency injection, decorators, exception filters, pipes, guards và interceptors được sử dụng tương tự như gateways. Mỗi khi có thể Nestjs sẽ *abstracts implement detail* để cùng một component có thể sử dụng trên nhiều nền tảng HTTP, WebSockets và Microservices. Sau đây sẽ đề cập đến khía cạnh này dành riêng cho WebSockets.

Trong Nest, một gateway là một class được annotated với một `@WebSocketGateWay()` decorator. Về mặt kỹ thuật, gateways không phụ thuộc vào nền tảng, nó có thể tương thích với bất kỳ thư viện WebSocket miễn là có một bộ adapter thích hợp. Để thuận tiện, NestJS hỗ trợ mặc định mạnh mẽ `socket.io` và `ws`. Bạn có thể chọn phương pháp phù hợp với ứng dụng của bạn. (Nếu chưa có adapter được public trên cộng đồng, bạn có thể tự tạo theo hướng dẫn sau).

>HINT
Gateways có thể được coi là providers; điều này có nghĩa là họ có thể chèn các phần phụ thuộc thông qua hàm tạo của lớp. Ngoài ra, các cổng cũng có thể được các lớp khác (nhà cung cấp và bộ điều khiển) đưa vào.

## Cài đặt

```bash
$ npm i --save @nestjs/websockets @nestjs/platform-socket.io
```

## Tổng quan

Mặc định, mỗi gateway sẽ lắng nghe trên cùng cổng với HTTP server, trừ khi ứng dụng không phải web hoặc bạn tự đổi cổng. Bạn có thể thay đổi hành vi này bằng cách truyền tham số vào decorator @WebSocketGateway(80), trong đó 80 là số cổng bạn chọn. Ngoài ra, bạn cũng có thể đặt namespace cho gateway bằng cách thêm tùy chọn namespace
```typescript
@WebSocketGateway(80, { namespace: 'events' })
```

>WARNING
Gateway sẽ không được khởi tạo (instantiate) cho đến khi bạn khai báo nó trong mảng providers của một module hiện có.
