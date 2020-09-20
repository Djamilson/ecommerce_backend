import { Request, Response } from 'express';
import Correios from 'node-correios';

export default class SearcherZipCodeController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { cep } = request.params;

    const correios = new Correios();
    try {
      const data = await correios.consultaCEP({ cep: '77018452' });
      return response.json(data);
    } catch (err) {
      console.log(err);
      return response.status(401).json({ erro: 'Erro' });
    }
  }
}
