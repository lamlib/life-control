import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class RegisterDTO {
    @ApiProperty({ description: 'Địa chỉ email người dùng muốn đăng ký làm tài khoản', example: 'lamlib2023@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    @Transform(({value}) => value.trim().toLowerCase())
    readonly emailAddress: string;

    @ApiProperty({ description: 'Mật khẩu tài khoản muốn đăng ký', example: 'pass123@SECRET' })
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    @Transform(({value}) => value.trim())
    readonly password: string;
}