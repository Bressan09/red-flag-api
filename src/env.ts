export const SALT_ROUNDS = 3;
export const API_KEY = '333';
export const API_PORT = '3000';

export let hosts: string[] = [];
if (process.env.NODE_ENV === 'production') {
  hosts = ['http://localhost:3000'];
} else {
  hosts = ['http://localhost:3000'];
}
