import { Controller, Post, Body, UseGuards, Get, Query, Req, Patch, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Controller('transactions')
@UseGuards(JwtStrategy)
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('overview')
    async getDashboardOverview(@Req() req: any) {
        const userId = req.user.userId; // Extract user ID from authenticated user
        return await this.transactionService.getDashboardOverview(userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('send')
    async sendMoney(
        @Body('senderWallet') senderWallet: string,
        @Body('receiverWallet') receiverWallet: string,
        @Body('amount') amount: number,
    ) {
        return this.transactionService.sendMoney(senderWallet, receiverWallet, amount);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    @Roles('admin', 'user')
    async getTransactions(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('status') status?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const filters = {};
        if (status) filters['status'] = status;
        if (startDate && endDate) filters['date'] = { start: startDate, end: endDate };
        const isAdmin = req.user.role === 'admin';
        const userId = req.user.userId;
        return this.transactionService.getTransactions(userId, page || 1, limit || 10, filters, isAdmin);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id/status')
    async updateTransactionStatus(
        @Param('id') id: string,
        @Body('status') status: string,
    ) {
        return this.transactionService.updateTransactionStatus(id, status);
    }


}
