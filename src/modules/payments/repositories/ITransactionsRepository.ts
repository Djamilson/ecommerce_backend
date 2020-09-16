import ICreateTransactionDTO from '../dtos/ICreateTransactionDTO';
import Transaction from '../infra/typeorm/entities/Transaction';

export default interface ITransactionsRepository {
  // findAllTransactionsToPerson(id: string): Promise<Transaction[] | undefined>;
  /* findByTransaction(
    data: ICreateTransactionDTO,
  ): Promise<Transaction | undefined>; */
  findById(id: string): Promise<Transaction | undefined>;
  /*
  createListTransaction(
    transactions: ICreateTransactionDTO[],
  ): Promise<Transaction[]>; */
  create(data: ICreateTransactionDTO): Promise<Transaction>;
  save(transaction: Transaction): Promise<Transaction>;
}
