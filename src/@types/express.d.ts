declare namespace Express {
  export interface Request {
    user: {
      id: string;
      person: {
        id: string;
      };
    };
  }
}
