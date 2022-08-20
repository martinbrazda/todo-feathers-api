// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import app from '../app';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const existingUsers: any = await app.service("users").find({query: {username: context.data?.username}});

    if (existingUsers.total > 0) {
      throw new Error("User with that username already exists");
    }

    return context;
  };
};
