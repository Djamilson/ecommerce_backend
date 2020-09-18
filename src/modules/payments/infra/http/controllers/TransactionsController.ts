import { Request, Response } from 'express';
import { container } from 'tsyringe';

import FindTransactionService from '@modules/payments/services/FindTransactionService';

export default class TransactionsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { order_id } = request.params;

    const findTransaction = container.resolve(FindTransactionService);

    const transaction = await findTransaction.execute({ order_id });

    console.log('MMMM>>', transaction);
    return response.json(transaction);
  }
}
