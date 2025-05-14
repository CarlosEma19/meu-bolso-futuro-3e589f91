
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

export type UserCredentials = {
  email: string;
  password: string;
};

export type UserRegistration = {
  name: string;
  email: string;
  password: string;
};
