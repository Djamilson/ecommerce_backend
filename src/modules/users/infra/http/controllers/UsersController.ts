import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';

export default class UserController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, groups } = req.body;

      console.log('minhas lista:: ', groups);
      const createUser = container.resolve(CreateUserService);

      const user = await createUser.execute({ name, email, password, groups });
      console.log('criado passou:: ', groups);
      
      return res.json(classToClass(user));
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
