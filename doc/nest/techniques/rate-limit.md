# Rate limit - Giới hạn tần suất.
Đây là một kỹ thuật phổ biến để bảo vệ ứng dụng của bạn khỏi các tấn công `brute-force`. Để bắt đầu sử dụng bạn cần cài đặt gói `@nestjs/throttler`.

```bash
npm i --save @nestjs/throttler
```

Sau khi cài đặt xong, `ThrottlerModule` cần phải được cấu hình như các loại package khác trong NestJs với phương thức `forRoot` hoặc `forRootAsync`.

```typescript
@Module({
    imports: [
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60000,
                    limit: 10
                },
            ],
        }),
    ],
})
export class AppModule {}
```

Đoạn mã trên cài đặt global option với thông số chung là `ttl`, đây là `time to live` tính theo milliseconds, và `limit` là số lượng request tối đa trong khoảng ttl, nó được áp dụng với các routes của ứng dụng khi được bảo vệ bời guarded.

Một khi module được imported, bạn có thể bảo vệ ứng dụng của mình bằng cách sử dụng `ThrottlerGuard` gắn vào các route hoặc endpoint. Bạn có thể xem chi tiết cách mà guard được triển khai [tại đây](). Nếu bạn muốn gắn guard ở phạm vi toàn cục, bạn có thể tham khảo đoạn mã sau:
```javascript
{
    provide: APP_GUARD,
    useClass: ThrottlerGuard
}
```

## Multiple Throttler Definitions - Định nghĩa nhiều Throttler.
Sẽ có những lúc bạn muốn cài đặt nhiều throttling khác nhau, chẳng hạn như giới hạn 3 lần gọi một giây, 20 lần gọi trong 10 giây, hoặc 100 lần gọi trong một phút. Để có thể làm được điều này, bạn có thể cài đặt thêm các thông số tại mảng đã cấu hình ở section trước đó với tên của từng throttling. Để hiểu rõ hơn, xem ví dụ dưới đây.

```typescript
@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                name: 'short',
                ttl: 1000,
                limit: 3, // Tương ứng 180 request trên phút
            },
            {
                name: 'medium',
                ttl: 10000,
                limit: 20, // Tương ứng 120 request trên phút
            },
            {
                name: 'long',
                ttl: 60000,
                limit: 100, // Tương ứng 100 request trên phút
            },
        ])
    ]
})
```

---
> Nếu bạn thắc mắc tại sao forRoot lại có thể truyền đối số là Array thay vì Object, bạn có thể xem định nghĩa interface của chúng bằng cách bôi đen forRoot và nhấn F12 (trên VSCode) để xem chi tiết.

— Lamlib

## Customization - Tùy biến.
Việc sử dụng Throttler Guard tại phạm vi nhỏ hay là toàn cục thường phụ thuộc vào nhiều yếu tố không biết trước, việc bạn muốn loại trừ một hoặc nhiều endpoints ra khỏi phạm vi ảnh hưởng của Throttler Guard là trường hợp bạn có thể gặp phải. Để xử lý trường hợp này, bạn có thể sử dụng `@SkipThrottle()` decorator để bỏ qua throttler cho cả class (Controller) hoặc cho một route riêng lẻ. Decorator `@SkipThrottle` có thể được sử dụng lồng nhau. Mục đính là để *vô hiệu quá chính throttle bên ngoài*. Để có thể *vô hiệu hóa* bạn phải truyền một object là `{ default: false }`:

```typescript
@SkipThrottle()
@Controller('users')
export class UserController {}
```

Decorator `@SkipThrottle()` dùng để loại bỏ rate limit khỏi cả Controller với các endpoint của nó.

```typescript
@SkipThrottle()
@Controller('users')
export class UsersController {
    @SkipThrottle({ default: false })
    dontSkip() {
        return 'List users work with Rate limiting.';
    }

    doSkip() {
        return 'List users work withou Rate limiting.';
    }
}
```

Bạn cũng có thể sử dụng decorator `@Throttle()` để ghi đè `limit` và `ttl` được cài đặt toàn cục trước đó, giúp linh hoạt trong việc nới lỏng hay thắt chặt bảo mật. Nó có thể được dùng tại phạm vi controller hay endpoint. Từ phiên bản 5 trở đi, decorator này nhận vào một Object với một trường name tương ứng với name được định nghĩa trong section `multiple throttler defination`. Với trường hợp không có nhiều `throttler` được định nghĩa, lúc này cấu hình được truyền vào thuộc tính default của Object, để dễ hiểu hơn, xem ví dụ dưới đây:
```typescript
@Throttle({default: { limit: 3, ttl: 60000 }})
@Get()
findAll() {
    return 'List users work with custom rate limiting.';
}
```

## Proxy
Nếu ứng dụng của bạn đang chạy sau một proxy server, cần thiết để cấu hình một HTTP adapter để `trust the proxy`. Bạn có thể chỉ định HTTP adapter options cho Express hay Fastify để bật `trust proxy`.

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.set('trust proxy', 'loopback'); // Trust request from the loopback address
    await app.listen(3000);
}

bootstrap();
```

Bật `trust proxy` cho phép bạn lấy địa chỉ IP gốc từ `X-Forwarded-For` HTTP header. Bạn có thể điều chỉnh hành vi phù hợp với ứng dụng của bạn bằng cách trích xuất địa chỉ IP từ header thay vì phụ thuộc vào `req.ip`. Để dễ hiểu, xem ví dụ minh họa dưới đây.

```typescript
// throttler-behind-proxy.guard.ts
import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ThrottleBehindProxyGuard extends ThrottlerGuard {
    protected async getTracker(req: Record<string, any>): Promise<string> {
        return req.ips.length ? req.ips[0] : req.ip;
    }
}
```

## Websocket

Module throttler này có thể làm việc với websockets, nhưng nó sẽ cần một số class extention. Bạn có thể extend `ThrottlerGuard` và ghi đè phương thức `handleRequest` như sau:
```typescript
@Injectable()
export class WsThrottlerGuard extends ThrottlerGuard {
    async handleRequest(requestProps: ThrootlerRequest): Promise<boolean> {
        const {
            context,
            limit,
            ttl
            throttler,
            blockDuration,
            getTracker,
            generateKey,
        } = requestProps;

        const client = context.switchToWs().getClient();
        const tracker = client._socket.remoteAdress();
        const key = generateKey(context, tracker, throttler.name);
        const { totalHits, timeToExpire, isBlocked, timeToBlockExpire } = 
        await this.storageService.increment(
            key,
            ttl,
            limit,
            blockDuration,
            throttler.name,
        );

        const getThrottlerSuffix = (name: string) => name === 'default' ? '' : '-${name}';

        // Throw an error when user reached their limit.
        if (isBlocked) {
            await this.throwThrolingException(context, {
                limit, 
                ttl,
                key,
                tracker,
                totalHits,
                timeToExpire,
                isBlocked,
                timeToBlockExpire,
            })
        }
    }
}
```

---
> Nếu bạn đang dùng ws, bạn cần thay `_socket` bằng `conn`.

— Lamlib

Bạn cần chú ý và ghi nhớ các điều sau khi làm việc với Websockets.

- Guard không được đăng ký với `APP_GUARD` hoặc `app.useGlobalGuards()`
- Một khi chạm tới limit, Nest sẽ trả về một sự kiện `exception`, vì vậy hãy chuẩn bị listener cho exception này.

---
> Nếu bạn đang sử dụng `nestjs/platform-ws` bạn có thể sử dụng lại `client._socket.remoteAddress`

— Lamlib

## GraphQL

Decorator `Throttler Guard` có thể được sử dụng để làm việc với các GraphQL requests. Tiếp tục, bạn cần phải tạo một class kết thừa với phương thức getRequestResponse sẽ được ghi đè.

```typescript
@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
    getRequestResponse(context: ExecutionContext) {
        const gqlCtx = GqlExecutionContext.create(context);
        const ctx = gqlCtx.getContext();
        return { req: ctx.req, res: ctx.res };
    }
}
```

## Configuration - Cấu hình.
| Tên trường       | Mô tả                                                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| name             | Tên được dùng để đánh giấu nhằm nhận biết throttle nào đang được sử dụng, mặc định không truyền                                                                    |
| ttl              | Viết tắt của time to live, là thời gian giới hạn số lần request, đơn vị miliseconds                                                                                |
| limit            | Số lượng request tối đa được gọi trong khoảng thời gian đã cài đặt                                                                                                 |
| blockDuration    | Thời gian bị chặn sau khi request đạt tới limit. đơn vị miliseconds                                                                                                |
| skipIf           | Một hàm nhận vào đối số là một instance của ExecutionContext và trả về một giá trị boolean để bỏ qua throttle, tương tự @SkipThrottler(), nhưng dựa trên điều kiện |
| storage          | Custom storage để lưu trạng thái throttling (mặc định là in-memory). Có thể thay bằng Redis để dùng cho hệ thống phân tán.                                         |
| ignoreUserAgents | Mảng regex để bỏ qua throttling cho một số **User-Agent** nhất định.                                                                                               |
| throttlers       | Mảng các throttler set (như ví dụ `short`, `medium`, `long`).                                                                                                      |
| errorMessage     | Chuỗi hoặc hàm trả về thông báo lỗi khi vượt quá limit.                                                                                                            |
| getTracker       | Hàm xác định "dấu vết" (thường là IP) để phân biệt client. Mặc định dùng `req.ip`                                                                                  |
| generateKey      | Hàm tạo key lưu trong storage. Có thể tuỳ chỉnh để kết hợp IP + route.                                                                                             |

## Async Configuration - Cấu hình trong ngữ cảnh bất đồng bộ.

Một số trường hợp, bạn muốn cấu hình rate-limiting một các bất đồng bộ thay vì đồng bộ. Bạn có thể sử dụng phương thức `forRootAsync()`, nó cho phép dependency injection và `async` method:

Bạn có thể tham khảo cách tiếp cận sau:

```typescript
@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService)  => [
                {
                    ttl: config.get('THROTTLE_TTL'),
                    limit: config.get('THROTTLE_LIMIT'),
                },
            ],
        }),
    ],
})
export class AppModule {}
```

Bạn cũng có thể sử dụng cú pháp `useClass`:

```typescript
@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            useClass: ThrottlerConfigService,
        }),
    ],
})
export class AppModule {}
```

Bạn có thể sử dụng cách này, miễn là `ThrottlerConfigService` được implemens dựa trên interface `ThrottlerOptionsFactory`.

## Storage - Lưu trữ
Storage mặc định của module này là memory cache giúp theo dõi các yêu cầu tới khi chúng vượt quá thời gian tồn tại (TTL) được thiết lập bởi các tùy chọn toàn cục. Bạn có thể sử dụng trường storage trong cấu hình `ThrottlerModule`  với một class được triển khai từ interface `ThrottlerStorage`.

Cho các hệ thống phân tán, bạn có thể sử dụng một số open source storage chẳng hạn Redis để có một `single source of truth`.

---
> Interface `ThrottlerStorage` có thể imported từ `@nestjs/throttler`

— Lamlib


## Time Helpers - Các hàm thời gian hỗ trợ.

NestJs giới thiệu một vài phương thức helper để việc cấu hình thời gian dễ đọc hơn khi định nghĩa rate limit. `@nestjs/throttle` xuất ra năm helpers khác nhau là `seconds`, `minutes`, `hours`, `days` và `weeks`. Để có thể sử dụng chúng, bạn chỉ cần gọi `seconds(5)`, tương tự với bốn helpers còn lại, các helper này sẽ trả về milliseconds. 