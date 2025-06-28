import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTagDto {
    @ApiProperty({ description: 'Name of tag', example: '' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Description of tag', example: '' })
    @IsNotEmpty()
    @IsString()
    description: string;
}
