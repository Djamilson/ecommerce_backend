import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Section from '../infra/typeorm/entities/Section';
import ISectionsRepository from '../repositories/ISectionsRepository';

interface IRequest {
  name: string;
}

@injectable()
class CreateSectionService {
  constructor(
    @inject('SectionsRepository')
    private sectionsRepository: ISectionsRepository,
  ) {}

  public async execute({ name }: IRequest): Promise<Section> {
    const sectionExists = await this.sectionsRepository.findByName(name);

    if (sectionExists) {
      throw new AppError('There is already one section with this name');
    }

    const section = this.sectionsRepository.create({
      name,
    });

    return section;
  }
}

export default CreateSectionService;
