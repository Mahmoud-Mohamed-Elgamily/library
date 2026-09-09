import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBorrowingDto {
    @ApiProperty({ example: "cm123456789", description: "ID of the book borrowed" })
    @IsString()
    @IsNotEmpty()
    bookId!: string;
}