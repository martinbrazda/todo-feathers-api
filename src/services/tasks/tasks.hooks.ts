import { HooksObject } from "@feathersjs/feathers";
import * as authentication from "@feathersjs/authentication";
import { disallow } from "feathers-hooks-common";
import hasUserInParams from "../../hooks/has-user-in-params";
import isTaskEditor from "../../hooks/is-task-editor";
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [ authenticate("jwt") ],
    find: [],
    get: [],
    create: [hasUserInParams(), isTaskEditor()],
    update: [disallow("rest")],
    patch: [hasUserInParams(), isTaskEditor()],
    remove: [hasUserInParams(), isTaskEditor()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
