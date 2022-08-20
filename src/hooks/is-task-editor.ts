// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from "@feathersjs/feathers";
import app from "../app";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {

    let listId;
    if (context.method == "create") {
      // If the method is create, the list id should have been provided to us
      listId = context.data?.list;
    } else {
      // For other methods, we get task ID from the query, fetch the task and get list id from there
      if (!context.id) {
        throw new Error("No ID provided for the task");
      }
      const task = await app.service("tasks").get(context.id);
      listId = task.list;
    }

    if (!listId) {
      throw new Error("The task has no assigned list??"); // Shouldn't happen, but just to be safe
    }

    // Rest of this is the same as is-list-editor hook

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
