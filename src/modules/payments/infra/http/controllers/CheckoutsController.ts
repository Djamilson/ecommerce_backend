import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import pagarme from 'pagarme';
import { container } from 'tsyringe';
import { Transaction } from 'typeorm';

import ListCardsService from '@modules/payments/services/ListCardsService';

export default class CheckoutsController {
  public async index(req: Request, res: Response): Promise<Response> {
    console.log('req.body==>>', req.body);
    const {
      address,
      customer,
      card_hash,
      items,
      amount: amountClient,
      installments,
    } = req.body;

    try {

      const client = await pagarme.client.connect({
        api_key: process.env.PAGARME_API_KEY,
      });

      const fee = 1000;
      const amount = amountClient * 100 + fee;

      const pagarmeTransaction = await client.transactions.create({
        amount: parseInt(String(amount), 10),
        card_hash,
        customer: {
          name: customer.name,
          email: customer.email,
          country: 'br',
          type: 'individual',
          documents: [
            {
              type: 'cpf',
              number: customer.cpf,
            },
            {
              type: 'rg',
              number: customer.rg,
            },
          ],
          phone_numbers: [customer.phone],
          billing: {
            name: customer.name,
            address: {
              ...address,
              country: 'br',
            },
          },
          shipping: {
            name: customer.name,
            fee,
            delivery_date: '2020-09-11',
            expedited: false,
            address: {
              ...address,
              country: 'br',
            },
          },
          items: items.map((item: any) => ({
            id: String(item.id),
            title: item.title,
            unit_price: parseInt(String(item.price * 100), 10),
            quantity: item.amount,
            tangible: true,
          })),
        },
      });

      console.log('pagarmeTransaction::', pagarmeTransaction);

      /* const checkout = await Checkout.create({
        amount: parseInt(String(amount * 100), 10),
        fee,
      });
      // adicionando os produtos ao checkout
      await checkout.products().attach(
        items.map((item: any) => item.id),
        (row: any) => {
          const product = items.find((item: any) => item.id === row.product_id);
          row.amount = product.amount;
          row.total = product.price * product.amount * 100;
        },
      );

      const transactions = await Transaction.create({
        checkout_id: checkout.id,
        transaction_id: pagarmeTransaction.id,
        status: pagarmeTransaction.status,
        authorized_code: pagarmeTransaction.authorization_code,
        brand: pagarmeTransaction.card.brand,
        authorized_amount: pagarmeTransaction.authorized_amount,
        tid: pagarmeTransaction.tid,
        installments,
      }); */
      // console.log('minha transactions', transactions.toJSON());
    } catch (error) {}

    const listCards = container.resolve(ListCardsService);

    const cards = await listCards.execute();

    return res.json(classToClass(cards));
  }
}
