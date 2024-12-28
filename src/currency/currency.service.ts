import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CurrencyService {
    private readonly apiKey: string;
    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.apiKey = this.configService.get<string>('EXCHANGE_RATE_API_KEY');
        this.baseUrl = this.configService.get<string>('EXCHANGE_RATE_BASE_URL');
    }

    async getConversionRate(from: string, to: string): Promise<number> {
        const url = `${this.baseUrl}/${this.apiKey}/pair/${from}/${to}`;
        try {
            const response = await firstValueFrom(this.httpService.get(url));
            return response.data.conversion_rate;
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch conversion rate');
        }
    }
}
