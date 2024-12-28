import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private readonly blacklist = new Set<string>(); // Simple in-memory blacklist

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async register(name: string, email: string, password: string, confirmPassword: string) {
        if (password !== confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        await this.userRepository.save(user);
        return { message: 'User registered successfully' };
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('No User Exist');
        }
        if (!await bcrypt.compare(password, user.password)) {
            throw new BadRequestException('Invalid email or password');
        }
        const payload = { id: user.id, role: user.role, name: user.name, email: user.email };
        const token = this.jwtService.sign(payload, { expiresIn: '10h' },);
        return { accessToken: token, ...payload };
    }

    async logout(token: string) {
        if (!token) {
            throw new BadRequestException('Token is required.');
        }
        this.blacklist.add(token);
        return { message: 'Logged out successfully' };
    }

    isTokenBlacklisted(token: string): boolean {
        return this.blacklist.has(token);
    }

}
