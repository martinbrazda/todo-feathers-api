// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from "@feathersjs/feathers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.params?.query) {
      const q = context.params.query;
      context.params.query = {};

      if (q._id) {context.params.query._id = q._id;}
      if (q.author) {context.params.query.author = q.author;}

      // For pagination
      if (q.$skip) {context.params.query.$skip = q.$skip;}

      // console.log(context.params.query);
    }


    return context;
  };
};
