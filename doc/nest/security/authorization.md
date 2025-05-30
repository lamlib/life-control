# Authorization

**Authorization** là một quá trình xác định xem người dùng có khả năng làm gì. Ví dụ, người dùng quản trị viên có thể create, edit, và delete posts. Những người không phải quản trị viên chỉ được quyền đọc mà thôi.

**Authorization** độc lập với authentication. Tuy nhiên, authorization yêu cầu một cơ chế của authentication.

Có rất nhiều cách tiếp cận và chiến lược xử lý authorization. Cách triển khai tuỳ thuộc vào yêu cầu ứng dụng, những chia sẻ sau đây sẽ giúp bạn sử dụng, tham khảo trong hầu hết các trường hợp.

## Triển khai RBAC đơn giản

