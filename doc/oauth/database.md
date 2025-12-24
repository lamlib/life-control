# Xây dựng Oauth gateway / SSO core

Database 
-> 
NestJS đọc cấu hình
-> 
Tự build OAuth URL
-> 
Redirect URL
-> 
Callback xử lý chung cho N provider

## Bảng cơ sở dữ liệu - database
Tên bảng: External Provider
Các cột:
- ID
- Name (Google, Github, Foxconn, .v.v)
- Client ID
- Client Secret
- Auth URL
- Token URL
- User Info URL
- Scope
- Redirect URL
- Enabled
- Create At

Bảng này chỉ cần trường Create At do Best Practice, chỉ có Developer, Admin System mới thao tác với bảng này. //TODO: Giải thích lý do, dẫn link tới một bài viết

## Tạo endpoint login động theo provider
GET /auth/:provider

