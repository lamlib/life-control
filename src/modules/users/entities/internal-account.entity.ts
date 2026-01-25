import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class InternalAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Tên tài khoản' })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  username: string;

  @ApiProperty({ description: 'Mật khẩu sau khi được băm' })
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  passwordHash: string;

  @ApiProperty({ description: 'Muối được rắc vào khi băm mật khẩu' })
  @Column({ type: 'varchar', length: 128, nullable: false, unique: true })
  passwordSalt: string;

  @ApiProperty({ description: 'Địa chỉ email được dùng để tạo tài khoản và đăng nhập do người dùng cung cấp' })
  @Column({ type: 'varchar', length: 255, unique: true })
  emailAddress: string;

  @ApiProperty({ description: 'Token được sinh ra lúc người dùng xác nhận địa chỉ email, sau khi dùng xong hoặc hết hạn thì xóa' })
  @Column({ type: 'text', nullable: true })
  confirmationToken: string | null;

  @ApiProperty({ description: 'Thời hạn token xác nhận email hết hạn, dùng để kiểm tra tính hợp lệ của token xác nhận email, tồn tại khi token tồn tại, xóa khi token không tồn tại' })
  @Column({ type: 'timestamp', nullable: true })
  confirmationTokenExpire: Date | null;

  @ApiProperty({ description: 'Token được sinh ra khi người dùng gửi yêu cầu đổi mật khẩu, sau khi dùng xong hoặc hết hạn thì xóa' })
  @Column({ type: 'varchar', length: 128, nullable: true })
  passwordRecoveryToken: string;

  @ApiProperty({ description: 'Thời hạn token lấy lại mật khẩu hết hạn, dùng để kiểm tra tính hợp lệ của token xác nhận lấy lại mật khẩu, tồn tại khi token tồn tại, xóa khi token không tồn tại' })
  @Column({ type: 'timestamp', nullable: true })
  passwordRecoveryTokenExpire: Date;

  @ApiProperty({ description: 'FK trỏ tới offical account của system này' })
  @Column({ nullable: false })
  accountId: number;

  @ApiProperty({ description: 'FK trỏ tới thuật toán băm mật khẩu sử dụng khi băm mật khẩu vào trường passwordHash của record này' })
  @Column({ nullable: true })
  hashingAlgorithmId: number;

  @ApiProperty({ description: 'FK trỏ tới trạng thái của trường email record này' })
  @Column({ nullable: true })
  emailStatusId: number;
}
