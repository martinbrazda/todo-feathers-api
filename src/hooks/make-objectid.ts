// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from "@feathersjs/feathers";
import { ObjectId } from "mongodb";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options: { type?: string; key: string }): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    if (options.type == "data") {
      if (!context.data) {
        throw new Error("No data provided");
      }

      const value = context.data[options.key];

      if (!value) {
        return context; // Don't change anything, just return. Input validator should have already taken care of whether this value is required or optional
      }

      // console.log("make-oid: value:", options, value);

      if (Array.isArray(value)) {
        context.data[options.key] = context.data[options.key].map((item: any) => new ObjectId(item));
      } else {
        context.data[options.key] = new ObjectId(context.data[options.key]);
      }
    }

    if (options.type == "query") {
      if (!context.params.query) {
        throw new Error("No query provided");
      }

      const value = context.params.query[options.key];

      if (!value) {
        return context; // That key doesn't exist in our query. Continue.
      }

      if (Array.isArray(value)) {
        context.params.query[options.key] = context.params.query[options.key].map((item: any) => new ObjectId(item));
      } else {
        context.params.query[options.key] = new ObjectId(context.params.query[options.key]);
      }
    }


    return context;
  };
};
