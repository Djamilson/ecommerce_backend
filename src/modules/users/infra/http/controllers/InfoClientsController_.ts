import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

// import CreateAddressService from '@modules/users/services/CreateAddressService';
// import CreatePhoneService from '@modules/users/services/CreatePhoneService';
import UpdatePersonService from '@modules/users/services/UpdatePersonService';

export default class InfoClientsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      console.log('==>>');
      const user_id = req.user.id;

      // console.log('person_id:', req.user);
      const {
        cpf,
        birdthDate,
        rg,
        rgss,
        street,
        number,
        complement,
        neighborhood,
        zip_code,
        city_id,
        phoneItems,
      } = req.body;


      // const createAddress = container.resolve(CreateAddressService);
      const updatePerson = container.resolve(UpdatePersonService);
      // const createPhone = container.resolve(CreatePhoneService);

       console.log('req.body:: ', req.body);
      const person = await updatePerson.execute({
        user_id,
        cpf,
        birdthDate,
        rg,
        rgss,
      });

      /* const address = await createAddress.execute({
        number,
        street,
        complement,
        zip_code,
        neighborhood,
        user_id,
        city_id,
      }); */

      return res.json(classToClass(person));
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
