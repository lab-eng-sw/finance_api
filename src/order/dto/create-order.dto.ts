export class CreateOrderDto {
    assets: {
        ticker: string;
        quantity: number;
    }[]
    walletId: number;
}