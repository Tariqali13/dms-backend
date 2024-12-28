import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    Req,
    Query,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { AuthGuard } from '@nestjs/passport';

@Controller('wallet')
@UseGuards(JwtStrategy)
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    // Create a new wallet
    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    async createWallet(
        @Req() req,
        @Body('walletNumber') walletNumber: string,
        @Body('userId') userId: string,
        @Body('name') name: string,
        @Body('currency') currency: string,
        @Body('balance') balance: number,
    ) {
        return this.walletService.createWallet(userId, walletNumber, name, currency, balance);
    }

    // Get all wallets for a user
    @UseGuards(AuthGuard('jwt'))
    @Get('/all')
    async getAllWallets(@Query('walletNumber') walletNumber: string, @Query('walletName') walletName: string) {
        return this.walletService.getAllWallets(walletNumber, walletName);
    }

    // Get all wallets for a user
    @UseGuards(AuthGuard('jwt'))
    @Get(':userId')
    async getUserWallets(@Param('userId') userId: string) {
        return this.walletService.getUserWallets(userId);
    }

    // Update wallet balance
    @UseGuards(AuthGuard('jwt'))
    @Patch(':walletId/balance')
    async updateWalletBalance(
        @Param('walletId') walletId: string,
        @Body('balance') newBalance: number,
    ) {
        return this.walletService.updateWalletBalance(walletId, newBalance);
    }


    // Delete a wallet
    @UseGuards(AuthGuard('jwt'))
    @Delete(':walletId')
    async deleteWallet(@Param('walletId') walletId: string) {
        return this.walletService.deleteWallet(walletId);
    }
}
