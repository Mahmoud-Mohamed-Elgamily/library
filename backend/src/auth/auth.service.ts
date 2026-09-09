import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private jwtService: JwtService) { }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) { throw new UnauthorizedException("Invalid Credentials") }

        const passwordMatches = await bcrypt.compare(password,
            user.passwordHash,
        );

        if (!passwordMatches) { throw new UnauthorizedException("Invalid Credentials") }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };

        const accessToken = await this.jwtService.signAsync(payload)

        return {
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
}
