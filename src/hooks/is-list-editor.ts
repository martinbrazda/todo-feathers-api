// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from "@feathersjs/feathers";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const listId = context.id;

    if (!listId) {
      throw new Error("No ID provided for the list");
    }


    const list = await context.app.service("lists").get(listId);

    if (!list) {
      throw new Error("No list with this ID");
    }

    if (list.author?.equals(context.params.user?._id)) {
      return context;
    }

    for (const editor of list.editors) {
      if (editor.equals(context.params.user?._id)) {
        return context;
      }
    }

    // console.log(list, context.params.user?._id);

    throw new Error("Not authorized to edit this list");
  };
};
