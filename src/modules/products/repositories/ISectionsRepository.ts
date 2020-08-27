import ICreateSectionDTO from '../dtos/ICreateSectionDTO';
import Section from '../infra/typeorm/entities/Section';

export default interface ISectionsRepository {
  findById(id: string): Promise<Section | undefined>;
  findByName(name: string): Promise<Section | undefined>;
  create(data: ICreateSectionDTO): Promise<Section>;
  save(section: Section): Promise<Section>;
}
