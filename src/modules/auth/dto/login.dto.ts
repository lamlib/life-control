import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Địa chỉ email đã đăng ký làm tài khoản của người dùng',
    example: 'lamlib2023@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  readonly emailAddress: string;

  @ApiProperty({
    description: 'Mật khẩu tài khoản người dùng',
    example: 'pass123@SECRET',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  readonly password: string;
}
