import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async register(
        @Body() body: { name: string; email: string; password: string; confirmPassword: string }
    ) {
        return this.authService.register(body.name, body.email, body.password, body.confirmPassword);
    }

    @Post('signin')
    async login(@Body() body: { email: string; password: string }) {
        return this.authService.login(body.email, body.password);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    async logout(@Req() req) {
        const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
        return this.authService.logout(token);
    }
}
