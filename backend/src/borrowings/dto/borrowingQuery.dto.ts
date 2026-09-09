import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { BorrowingStatus } from "generated/prisma/enums";

export class BorrowingQueryDto {
    @ApiPropertyOptional({ enum: BorrowingStatus, example: BorrowingStatus.ACTIVE, description: "Filter borrowings by status" })
    @IsOptional()
    @IsEnum(BorrowingStatus)
    status!: BorrowingStatus;
}