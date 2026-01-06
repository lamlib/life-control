# Hướng dẫn sử dụng PM2 quản lý ứng dụng Nodejs

**Kiểm tra version pm2**
```bash
$ pm2 --version
```

**Kiểm tra các ứng dụng đang chạy**
```bash
$ pm2 list
```

**Chạy ứng dụng (ở cluster mode) nếu không thấy trong danh sách đang chạy**
- Nếu sử dụng script npm
```bash
$ pm2 start --name <your-application-name> -i max npm -- run <script>
```
- Nếu chạy trực tiếp tập tin entry point javascript của ứng dụng
```bash
$ pm2 start --name <your-application-name> -i max <your-entry-point> 
```
pm2 start --name backend-app 
**Nếu ứng dụng đang chạy, cần xử lý để zero downtime**
- Backup artifact cũ và xuất bản artifact mới 
- Reload thay vì restart
```bash
pm2 reload <your-application-name>
```
- Theo dõi log/health để đảm bảo dịch vụ không gián đoạn


**Dừng tiến trình đang chạy**
```bash
pm2 stop <your-application-name>
```
**Xóa tiến trình đã dừng**
```bash
pm2 delete <your-application-name>
```

**Nếu không ở chế độ cluster, bạn muốn khởi động lại, không dùng reload mà dùng restart**
```bash
pm2 restart <your-application-name>
```