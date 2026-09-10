import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateBookDto {
    @ApiProperty({
        example: "Clean Code",
    })
    @IsString()
    @IsNotEmpty()
    title!: string;

    @ApiProperty({
        example: "Robert C. Martin",
    })
    @IsString()
    @IsNotEmpty()
    author!: string;

    @ApiProperty({
        example: "9780132350884",
    })
    @IsString()
    @IsNotEmpty()
    isbn!: string;

    @ApiProperty({
        example: "Programming",
    })
    @IsString()
    @IsNotEmpty()
    category!: string;

    @ApiProperty({
        example: 5,
        minimum: 1
    })
    @IsInt()
    @Min(1)
    totalCopies!: number;
}