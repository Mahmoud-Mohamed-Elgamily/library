import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class BookQueryDto {
    @ApiPropertyOptional({
        example: "clean",
        description: "Search by title, author, or ISBN"
    })
    @IsOptional()
    @IsString()
    search?: string;
}