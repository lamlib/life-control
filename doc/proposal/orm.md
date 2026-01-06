Chúng ta sẽ tiếp cận với TypeORM để làm việc thuận tiện hơn với Database

## 1. Làm quen với thư viện

TypeORM là một ORM chạy trên môi trường Node.js, Browser, Cordova, Ionic, React Native, NativeScript, Expo, và Electron platforms và nó được sử dụng với JavaScript và TypeScript (ES2021).

Mục tiêu của TypeORM là luôn luôn hỗ trợ tính năng mới nhất của JavaScript cũng như cung cấp thêm các tính năng bổ sung hỗ trợ thao tác với cơ sở dữ liệu, từ các ứng dụng nhỏ với một vài bảng dữ liệu cho tới các ứng dụng quy mô lớn với rất nhiều cơ sở dữ liệu riêng biệt.

TypeORM nổi trội trong việc hỗ trợ đa dạng các loại cơ sở dữ liệu hơn bất kỳ thư viện nào khác: Google Spanner, Microsoft SQL Server, MongoDB, MySQL/MariaDB, Oracle, Postgres, SAP HANA và SQLLite, và nhiều loại cơ sở dữ liệu khác cùng driver của chúng.

TypeORM hỗ trợ cả Active Record và Data Mapper patterns, không giống như các thư viện tương tự đang tồn tại. 
Điều này có nghĩa là bạn có thể viết các ứng dụng chất lượng cao, có tính liên kết lỏng lẻo, có khả năng mở rộng và dễ bảo trì theo cách hiệu quả nhất.

Thực chất TypeORM được lấy ý tưởng từ các thư viện ORMs khác, chẳng hạn Hibernate, Doctrine và Entity Framework.

### Tính năng

- Hỗ trợ cả DataMapper và ActiveRecord (tùy thuộc vào lựa chọn của bạn)
- Entities và Columns
- Chỉ định kiểu dữ liệu cho Columns.
- Quản lý Entity
- Repositories and custom repositories.
- Clean object-relational model.
- Associations (relations).
- Eager and lazy relations.
- Unidirectional, bidirectional, and self-referenced relations.
- Supports multiple inheritance patterns.
- Cascades
- Indices
- Transaction
- Migrations with automatic generation.
- Connection pooling.
- Replication.
- Using multiple database instances.
- Working with multiple database types.
- Cross-database and cross-schema queries.
- Elegant-syntax, flexible and powerful QueryBuilder
- Left and inner join
- Proper pagination for queries using joins.
- Query caching.
- Streaming raw result.
- Logging.
- Listeners and subcribers (hooks).
- Supports closure table pattern.
- Schema declaration in models or separate configuration files.
- Support MySQL/MariaDB/Postgres/CockroachDB/SQLite/Microsoft SQL Server/Oracle/SAP Hana/sql.js.
- Supports MongoDB NoSQL database.
- Works in Node.js/Browser/Ionic/Cordova/ReactNative/NativeScript/Expo/Electron platforms.
- TypeScript and JavaScript support.
- ESM and CommonJS support.
- Produced code is performant, flexible, clean, and maintainable.
- Follows all possible best practices.
- CLI.

Và nhiều tính năng nữa...

Với TypeORM, models của bạn sẽ trông giống như thế này:

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: String;

    @Column()
    lastName: String;

    @Column()
    age: number;
}
```

Và domain logic của bạn sẽ như thế này:

```typescript
const userRepository = AppDataSource.getRepository(User);

const user = new User();

user.firstName = "Timber";
user.lastName = "Saw";

user.age = 25;

await userRepository.save(user);

const allUsers = await userRepository.find();
const firstUsers = await userRepository.findOneBy({
    id: 1,
});
const timber = await userRepository.findOneBy({
    firstName: "Timber",
    lastName: "Saw",
});

await userRepository.remove(timber);
```

Thay vào đó, nếu bạn muốn sử dụng `ActiveRecord`, bạn có thể sử dụng như sau:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;
}
```

Và domain logic của chúng ta sẽ trông như thế này:

```typescript
const user = new User();
user.firstName = "Timber";
user.lastName = "Saw";
user.age = 25;

await user.save();

const allUsers = await User.find();
const firstUser = await User.findOneBy({
    id: 1
});
const timber = await User.findOneBy({
    firstName: "Timber",
    lastName: "Saw",
});

await timber.remove();
```

