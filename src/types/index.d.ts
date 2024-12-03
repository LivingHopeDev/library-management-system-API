declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

export interface IUserSignUp {
  username: string;
  email: string;
  password: string;
}
export interface IUserLogin {
  email: string;
  password: string;
}
