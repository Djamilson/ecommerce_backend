import ICreatePhoneDTO from '../dtos/ICreatePhoneDTO';
import Phone from '../infra/typeorm/entities/Phone';

export default interface IPhonesRepository {
  findAllPhonesToPerson(id: string): Promise<Phone[] | undefined>;
  findByPhone(data: ICreatePhoneDTO): Promise<Phone | undefined>;
  findById(id: string): Promise<Phone | undefined>;
  create(data: ICreatePhoneDTO): Promise<Phone>;
  save(phone: Phone): Promise<Phone>;
}
