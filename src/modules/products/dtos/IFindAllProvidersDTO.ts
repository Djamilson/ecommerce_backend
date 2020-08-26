interface IFindProductIdDTO {
  id: string;
}

export default interface IFindAllProvidersDTO {
  listIDProduct: IFindProductIdDTO[];
}
