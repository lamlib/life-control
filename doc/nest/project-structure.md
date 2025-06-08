# Cấu trúc dự án NestJS tiêu chuẩn

```bash
nestjs-app/
├── src/
│   ├── main.ts                      # Entry point
│   ├── app.module.ts                # Root module
│
│   ├── config/                      # Cấu hình hệ thống (env, database, jwt...)
│   │   ├── configuration.ts
│   │   ├── database.config.ts
│   │   └── jwt.config.ts
│
│   ├── common/                      # Mã dùng chung toàn app
│   │   ├── constants/               # Biến cố định
│   │   ├── decorators/              # Custom decorators
│   │   ├── enums/                   # Enum dùng toàn app
│   │   ├── exceptions/              # Exception filters
│   │   ├── guards/                  # Auth guards
│   │   ├── interceptors/            # Logging, Transform, Cache...
│   │   ├── middleware/              # Nest middleware
│   │   └── pipes/                   # Custom pipes
│
│   ├── shared/                      # Những phần có thể dùng chung giữa các module
│   │   ├── base/
│   │   ├── interfaces/
│   │   └── utils/
│
│   ├── database/                    # Kết nối DB, migrations, seeding
│   │   ├── database.module.ts
│   │   ├── database.providers.ts
│   │   └── migrations/
│
│   ├── modules/                     # Các module chính
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto/
│   │   │   ├── strategies/
│   │   │   └── guards/
│   │   │
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   │       └── user.entity.ts
│   │   │
│   │   └── products/
│   │       ├── products.module.ts
│   │       ├── products.controller.ts
│   │       ├── products.service.ts
│   │       ├── dto/
│   │       └── entities/
│   │           └── product.entity.ts
│
│   ├── interfaces/                  # Interface tổng hợp
│   │   └── user.interface.ts
│
├── test/                            # Test e2e hoặc unit
│   └── app.e2e-spec.ts
│
├── .env                             # Biến môi trường
├── .env.example                     # File mẫu biến môi trường
├── tsconfig.json
├── package.json
├── nest-cli.json
└── README.md
```

## Sự khác biệt giữa thư mục interfaces/ và shared/interfaces/

1. shared/interfaces/ là thư mục chứa các interfaces chỉ phục vụ trong phạm vi shared, giúp tránh *global pollution*
2. interfaces/ là thư mục chứa các interfaces được sử dụng ở bất cứ đâu trong hệ thống.