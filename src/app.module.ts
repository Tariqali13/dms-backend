import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '@nestjs-modules/ioredis';
import { CurrencyModule } from './currency/currency.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminSeeder } from './seeder/admin.seeder';
import { User } from './auth/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    WalletModule,
    TransactionModule,
    CurrencyModule,
    TypeOrmModule.forFeature([User]), // Ensure User entity is registered

    // Use TypeOrmModule.forRootAsync so that we can inject ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: +configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    // Similarly for Mongoose
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    // And for Redis
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get<string>('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AdminSeeder],
})
export class AppModule { }
