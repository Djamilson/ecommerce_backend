import Product from '../infra/typeorm/entities/Product';

export default interface IPaginatedProductsResultDTO {
  data: Product[];
  page: number;
  limit: number;
  totalCount: number;
}
