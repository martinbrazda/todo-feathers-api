// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from "@feathersjs/feathers";
import { ObjectId } from "mongodb";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    if (!context.id) {
      throw new Error("No ID provided");
    }

    if (!ObjectId.isValid(context.id)) {
      throw new Error("ID is not a valid ObjectId");
    }

    return context;
  };
};
