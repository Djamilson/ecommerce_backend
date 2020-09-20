import { inject, injectable } from 'tsyringe';

import PaginatedProductsResultDTO from '../dtos/IPaginatedProductsResultDTO';
import IPaginationsDTO from '../dtos/IPaginationsDTO';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(
    paginationDTO: IPaginationsDTO,
  ): Promise<PaginatedProductsResultDTO> {
    // const skippedItems = (paginationDTO.page - 1) * paginationDTO.limit;

    // const totalCount = await this.productsRepository.count();
    const products = await this.productsRepository.findAll(paginationDTO);
    console.log('products: ', products);
    
    return {
      totalCount: 0,
      page: paginationDTO.page,
      limit: paginationDTO.limit,
      data: products,
    };
  }
}

export default ListProductsService;
