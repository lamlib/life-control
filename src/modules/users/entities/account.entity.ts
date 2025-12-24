import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Tên gọi chính của người dùng tài khoản' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  firstName: string;

  @ApiProperty({ description: 'Họ của người dùng tài khoản' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  lastName: string;

  @ApiProperty({ description: 'Giới tính của người dùng tài khoản' })
  @Column({ type: 'char', length: 1, nullable: true })
  gender: string;

  @ApiProperty({ description: 'Ngày sinh của người dùng tài khoản' })
  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @ApiProperty({ description: 'Địa chỉ email chính của người dùng tài khoản' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  emailAddress: string;

  @ApiProperty({ description: 'Tên account người dùng tài khoản' })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  username: string;

  @ApiProperty({ description: 'FK trỏ về vai trò được gán cho người dùng tài khoản trong hệ thống' })
  @Column({ type: 'int', nullable: false })
  roleId: number;
}
