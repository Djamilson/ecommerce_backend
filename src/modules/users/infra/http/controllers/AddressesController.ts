import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAddressService from '@modules/users/services/CreateAddressService';

export default class AddressesController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;

      console.log('person_id:', req.user);

      const person_id = '9989';

      const {
        number,
        street,
        complement,
        zip_code,
        neighborhood,
        city_id,
      } = req.body;

      console.log(
        'user:: ',
        number,
        street,
        complement,
        zip_code,
        neighborhood,
        city_id,
        user_id,
      );
      const createAddress = container.resolve(CreateAddressService);
      // const createUserGroups = container.resolve(CreateUserGroupsService);

      const address = await createAddress.execute({
        number,
        street,
        complement,
        zip_code,
        neighborhood,
        user_id,
        city_id,
      });
      return res.json(classToClass(address));
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
