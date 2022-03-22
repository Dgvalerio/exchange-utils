import { IUser } from './User.interface';

export interface IBase {
  label: string;
  ref: string;
  sha: string;
  user: IUser;
  repo: {};
}
