## Kiểm tra dung lượng các bản backup
```bash
du -sh /var/www/backups/*
```

## Kiểm tra tình trạng ổ cứng 
```bash
df -h
```

## Xóa backup cũ không dùng tới
```bash
sudo rm -rf /var/www/backups/backend_*
```

