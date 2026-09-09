import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: "Login to the Library System" })
    @ApiBody({ schema: { example: { email: 'admin@email.com', password: 'Admin123!' } } })
    @ApiResponse({ status: 201, description: 'Login Successful' })
    @ApiResponse({ status: 401, description: 'Invalid Credentials' })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }
}