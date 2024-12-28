import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CurrencyService } from './currency.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule, ConfigModule],
    providers: [CurrencyService],
    exports: [CurrencyService], // Export for use in other modules
})
export class CurrencyModule { }
