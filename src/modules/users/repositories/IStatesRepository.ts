import State from '../infra/typeorm/entities/State';

export default interface IAddressesRepository {
  findAll(): Promise<State[] | undefined>;
}
