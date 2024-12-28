import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSeeder implements OnApplicationBootstrap {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    async onApplicationBootstrap() {
        const adminEmail = 'admin@dms.com';
        const existingAdmin = await this.userRepository.findOne({ where: { email: adminEmail } });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = this.userRepository.create({
                name: 'Admin', // Align with User entity
                email: adminEmail,
                password: hashedPassword,
                role: 'admin', // Set as admin
            });

            await this.userRepository.save(admin);
        }
    }
}
