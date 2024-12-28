import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, // Ensure token expiration is checked
            secretOrKey: 'jwt-secret', // Replace with .env variable for security
        });
    }

    async validate(payload: any) {
        if (!payload) {
            throw new UnauthorizedException('Invalid token');
        }
        return { userId: payload.id, role: payload.role };
    }
}
