# Authetication

Xác thực là một phần **không thể thiểu** của hầu hết các ứng dụng. Có rất nhiều cách tiếp cận và chiến lược để xử lý xác thực. Việc đưa ra cách tiếp cận đúng 
cho từng project dựa vào yêu cầu cụ thể của ngữ cảnh. Chapter sau sẽ trình bày các cách xác thực có thể sử dụng và biến đổi theo nhiều yêu cầu.

Hãy giả lập ra một yêu cầu phổ biến. Với trường hợp này, cliens sẽ bắt đầu bằng việc xác thực với username và password. Một khi xác thực hoàn tất, máy chủ 
sẽ cấp một JWT token sẽ được người dùng gửi lại khi yêu cầu tài nguyên thông qua authorization header như là một bearer token. Chúng ta cần tạo một protected route
chỉ có thể truy cập được khi người dùng có JWT hợp lệ.

Chúng ta sẽ bắt đầu với yêu cầu đầu tiên: xác thực người dùng. Sau đó chúng ta sẽ mở rộng nó bằng cách cấp phát một JWT. Cuối cùng, chúng ta sẽ tạo một protected route
có khả năng kiểm tra tính hợp lệ của JWT.

## Tạo một module xác thực

Chúng ta sẽ bắt đầu bằng việc tạo một `AuthModule`, trong module này chứa một `AuthService` và một `AuthController`. Chúng ta sẽ sử dụng `AuthService` để triển khai logic
xác thực, và `AuthController` để đưa ra các endpoint xác thực.

```bash
$ nest g module auth
$ nest g controller auth
$ nest g service auth
```

Khi chúng ta triển khai `AuthService`, sẽ thấy có logic liên quan đến người dùng, do đó ngay từ bây giờ, hãy đóng gói các thao tác người dùng trong một `UsersService`, vì 
vậy hãy tạo module chứa nó và service đó

```bash
$ nest g module users
$ nest g service users
```

Thay đổi nội dung gốc của các file bằng mã phía dưới. Cho ứng dụng mẫu này, `UsersService` đơn giản chỉ duy trì một hard-code in-memory danh sách người dùng, và một 
phương thức tìm kiếm để lấy ra người dùng bằng username. Trong các ứng dụng thực tế, đây là nơi mà bạn cần xây dựng một user model và persistence layer, sử dụng thư
viện mà bạn muốn (e.g., TypeORM, Sequelize, Mongoose, etc.).

```typescript
// users/users.service.ts

import { Injectable } from '@nestjs/common';


// Đây nên là một class/interface thực tế đại diện cho một user entity
export type User = any;

@Injectable()
export class UsersService {
    private readonly users = [
        {
            userId: 1,
            username: 'john',
            password: 'changeme',
        },
        {
            userId: 2,
            username: 'maria',
            password: 'guess',
        },
    ];

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username == username);
    }
}
```

Trong `UserModule`, điều thay đổi cần thiết duy nhất là thêm vào một UserServices tại mảng của thuộc tính exports(tạo nếu chưa có) của `@Module` decorator để nó có thể
được sử dụng ở bên ngoài module(chúng ta sẽ sử dụng nó trong AuthService).

```typescript
import { Module } from '@nest/common';
import { UsersService } from './users.service';


@Module({
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
```

## Triển khai một "Sign in" endpoint

Service `AuthService` của chúng ta có nhiệm vụ lấy ra người dùng và kiểm tra mật khẩu có hợp lệ hay không. Chúng ta sẽ tạo phương thức signIn() để phục vụ công việc này. 
Trong đoạn mã phía dưới, chúng ta sử dụng cú pháp ES6 spread operator để loại bỏ trường mật khẩu trước khi trả về đối tượng người dùng cho phía client tránh rò rỉ thông tin,
đây là một kinh nghiệm thực chiến phổ biến khi trả về đối tượng người dùng, bởi bạn không muốn lộ ra các trường nhạy cảm như mật khẩu hoặc các khoá bảo mật khác.

```typescript
// auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        const { password, ...result } = user;

        //TODO: tạo ra một JWT và trả về nó tại đây
        // thay vì user object
        return result;
    }
}
```

===Warning==
Tất nhiên là trong ứng dụng thực tế, bạn sẽ không chứa password trong plain text. Bạn nên sử dụng các thư viện như bcrypt, với các thuật toán mã hoá một chiều. Với cách tiếp cận đó
lúc này bạn chỉ chứa password đã được mã hoá, khi xác thực bạn chỉ cần so sánh chuỗi đã được lưu lại với chuỗi password mã hoá mới nhất mà người dùng cung cấp. Với các ví dụ trên, chúng 
ta đã vi phạm nguyên tắc, đừng làm nó trong ứng dụng thực tế.

Bây giờ, chúng ta sẽ cập nhập `AuthModule` để import `UsersModule`


```typescript
// auth/auth.module.ts

import { Module } from '@nest/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from './users/users.module';


@Module({
    imports: [UsersModule],
    providers: [AuthService],
    controllers: [AuthController],
})

export class AuthModule {}
```

Sau khi import `UsersModule` vào trong `AuthModule`, bây giờ chúng ta có thể sử dụng service để gọi ra phương thức signIn() trong `AuthController`,
Từ đó, phương thức này có thể được gọi từ phía người dùng để xác thực. Nó sẽ nhận vào một username và password trong body, và trả về một JWT token 
nếu người dùng đã được xác thực.

```typescript
// auth/auth.controller.ts

import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    contructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.username, signInDt.password);
    }
}

```

===Gợi ý===
Một cách lý tưởng, thay vì sử dụng `Record<string, any>`, chúng ta nên sử dụng DTO class để định nghĩa hình thù của request body, Xem [validation]() chapter để hiểu rõ hơn.


## JWT token

Chúng ta đã tới phần JWT  cho hệ thống auth của chúng ta. Hãy 
xem lại và tinh chỉnh các yêu cầu:
+ Cho phép các người dùng xác thực bằng username/password, trả về một chuỗi JWT để sử dụng trong các yêu cầu tài nguyên
từ người dùng tới máy chủ. Để hoàn thanh fnos, chúng ta cần viết các đoạn mã cấp phát JWT.
+ Tạo một API routes để bảo về tài nguyên dựa trên sự hợp lệ 
của chuối JWT như là một bearer token

Chúng ta sẽ cần cài đặt thêm một gói nữa để hỗ trợ JWT.

```bash
$ npm install --save @nestjs/jwt
```

=== Gợi ý ===
Gói `@nestjs/jwt` (xem thêm ở [đây]()) là một utility package để giúp chúng ta thao tác với JWT. Nó bao gồm tạo và kiểm tra tính hợp lệ của JWT tokens.

Để giữ cho các services của chúng ta sạch sẽ theo chuẩn module, chúng ta sẽ xử lý tạo JWT trong `authService`. Mở file`auth.service.ts` trong thư mục `auth`, import JwtService
và cập nhập phương thức signIn để tạo ra JWT token như dưới đây:

```typescript
// auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    contructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

        async signIn(username: string, pass: string): Promise<{ access_token: string }> {
        const user = await this.usersService.findOne(username);
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.userId, username: user.username };


        return {
            access_token: await this.jwtService.signAsync(payload);
        };
    }
}
```

Chúng ta sử dụng thư viện `@nestjs/jwt`, nó cung cấp hàm `signAsync()` để tạo ra JWT từ một 
tập hợp các thông tin con của đối tượng `user`. Sau đó chúng ta trả về một object chỉ có một 
thuộc tính là access_token. Chú ý: chúng ta đặt tên thuộc tính là `sub` để chứa  giá trị `userId` để đồng nhất với tiêu chuẩn của JWT.

Bây giờ chúng ta sẽ cập nhập `AuthModule` để import một dependencies mới và cấu hình JwtModule.

Đầu tiên, tạo một file có tên `constants.ts` trong thư mục auth, và thêm đoạn mã sau:

```typescript
export const jwtConstants = {
    secret: 'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
}
```

Chúng ta sẽ sử dụng nó để chia sẻ chìa khoá cho các bước JWT signing và xác minh.

===Cảnh bảo===
Không tiết lộ key này ra bên ngoài. Chúng ta chỉ làm như bây giờ để cho tường minh, nhưng trong hệ 
thống production **bạn phải bảo vệ key** này bằng các biện pháp như secret vault, enviroment variable, hoặc configuration service.

Bây giờ, mở `auth.module.ts` trong thư mục `auth` và cập nhập nó như sau:

```typescript
// auth/auth.module.ts


import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

== Chú thích ==
Chúng ta đăng kí `JwtModule` là toàn cục để giữ cho mọi thứ 
dễ dàng. Điều đó có nghĩa là chúng ta không cần thiết phải 
import `JwtModule` mọi nơi trong ứng dụng của chúng ta

Chúng ta cấu hình `JwtModule` sử dụng `register()`, truyền vào một đối tượng cấu hình. Xem tại [đây]() để biết thêm về Nest `JwtModule` và [đây]() để hiểu rõ về các cấu hình trong đối tượng đã truyền vào.

Hãy bắt đầu kiểm tra routes của chúng ta bằng curl.

## Triển khai lớp bảo vệ xác thực

Bây giờ chúng ta có thể xử lý phần cuối cùng của yêu cầu: bảo vệ endpoints bằng cách yêu cầu kiểm tra mã JWT hợp lệ trong các request. Chúng ta sẽ thực hiện bằng việc tạo một `AuthGuard` dùng để bảo vệ routes của chúng ta.

```typescript
// auth/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

```

Bây giờ thì chúng ta có thể triển khai được các route được bảo vệ (bằng cách đăng ký `AuthGuard`)

Mở file `auth.controller.ts` và cập nhập như sau:

```typescript
// auth.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
```

Chúng ta đã đăng ký thành công `AuthGuard` vào trong `GET /profile`, bây giờ route này đã được bảo vệ.

Chắc chắn rằng ứng dụng đã chạy, kiểm tra router bằng `cURL`.

```bash
$ # GET /profile
$ curl http://localhost:3000/auth/profile
{"statusCode":401,"message":"Unauthorized"}

$ # POST /auth/login
$ curl -X POST http://localhost:3000/auth/login -d '{"username": "john", "password": "changeme"}' -H "Content-Type: application/json"
{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vybm..."}

$ # GET /profile using access_token returned from previous step as bearer code
$ curl http://localhost:3000/auth/profile -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vybm..."
{"sub":1,"username":"john","iat":...,"exp":...}
```

Chú ý rằng trong `AuthModule`, chúng ta đã cấu hình JWT sẽ hết hạn trong vòng `60 seconds`. Đây là một 
khoảng thời gian rất ngắn, chi tiết về vấn đề token expiration và refresh không nằm trong phạm vi của bài viết này. Tuy nhiên, ví dụ cài đặt 60s để cho thấy tác dụng của JWT. Nếu bạn đợi 60 giây sau, bạn sẽ nhận được phản hồi `401 Unauthorized`. Bời vì `@nestjs/jwt` tự động kiểm tra hạn sử dụng của JWT. Tiết kiệm cho bạn thời gian khi triển khai những vấn đề này trong ứng dụng của bạn.

Chúng ta đã hoàn thành triển khai JWT authentication. JavaScript clients (như Angular/React/Vue) và các ứng dụng JavaScript khác bây giờ đã có thể authenticate và communicate một cách an toàn với API Server.

## Kích hoạt authentication globally

Nếu trong trường hợp hầu hết các endpoints của bạn được bảo vệ một cách mặc định, bạn có thể đăng ký 
the authentication guard như là một `global guard`, và thay vì sử dụng `@UseGuards()` decorator trên top của từng controller, bạn có thể làm ngược lại bằng việc gắn các flag nên những routes muốn public.

Đầu tiên, đăng ký `AuthGuard` như là một global guard theo hướng dẫn sau (trong mọi module, ví dụ, trong `AuthModule`):

```bash
providers: [
    {
        provide: APP_GUARD,
        useClass: AuthGuard,
    }
],
```

Sau khi hoàn thành, Nest sẽ tự động gắn `AuthGuard` vào tất cả endpoints.

Bây giờ chúng ta phải cung cấp cơ chế để khai báo các routes sẽ public. Để làm điều này, chúng ta cần tạo một custom decorator sử dụng hàm `SetMetadata` decorator factory.

```typescript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

Trong tệp trên, chúng tôi đã xuất hai hằng số. Một người là khóa siêu dữ liệu của chúng tôi có tên là `IS_PUBLIC_KEY` và cái còn lại là bản thân trang trí mới của chúng tôi mà chúng tôi sẽ gọi công khai (bạn có thể đặt tên thay thế nó SkipAuth hoặc allowanon, bất cứ điều gì phù hợp với dự án của bạn). Bây giờ chúng tôi có một nhà trang trí @public () tùy chỉnh, chúng tôi có thể sử dụng nó để trang trí bất kỳ phương pháp nào, như sau:

```typescript
@Public()
@Get()
findAll() {
  return [];
}
```

Lastly, we need the AuthGuard to return true when the "isPublic" metadata is found. For this, we'll use the Reflector class (read more here).

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

## Tích hợp passport
Passport là thư viện xác thực Node.js phổ biến nhất, được cộng đồng nổi tiếng và được sử dụng thành công trong nhiều ứng dụng sản xuất. Thật đơn giản khi tích hợp thư viện này với một ứng dụng tổ bằng cách sử dụng mô -đun @NestJS/Passport. Để tìm hiểu làm thế nào bạn có thể tích hợp hộ chiếu với NestJS, hãy xem chương này.








