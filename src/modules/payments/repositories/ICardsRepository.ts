import CreditCard from '../infra/typeorm/entities/CreditCard';

export default interface IProductsRepository {
  findAllCard(): Promise<CreditCard[]>;
}
