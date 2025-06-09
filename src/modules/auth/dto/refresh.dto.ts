import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshDTO {
    @ApiProperty({ description: 'Refresh token để lấy lại access token' })
    @IsString()
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    readonly refreshToken: string;
}