import { getRepository, Repository } from 'typeorm';

import ICreateSectionDTO from '@modules/products/dtos/ICreateSectionDTO';
import ISectionsRepository from '@modules/products/repositories/ISectionsRepository';

import Section from '../entities/Section';

interface IFindSections {
  id: string;
}

class SectionsRepository implements ISectionsRepository {
  private ormRepository: Repository<Section>;

  constructor() {
    this.ormRepository = getRepository(Section);
  }

  public async findById(id: string): Promise<Section | undefined> {
    const section = await this.ormRepository.findOne(id);
    return section;
  }

  public async findByName(name: string): Promise<Section | undefined> {
    const section = await this.ormRepository.findOne({
      where: { name },
    });

    return section;
  }

  public async create(sectionData: ICreateSectionDTO): Promise<Section> {
    const section = this.ormRepository.create(sectionData);
    await this.ormRepository.save(section);

    return section;
  }

  public async save(section: Section): Promise<Section> {
    return this.ormRepository.save(section);
  }
}

export default SectionsRepository;
