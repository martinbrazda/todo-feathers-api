import * as feathersAuthentication from "@feathersjs/authentication";
import * as local from "@feathersjs/authentication-local";
import { disallow } from "feathers-hooks-common";
import Joi from "joi";
import validate from "feathers-validate-joi";
import isUsernameUnique from "../../hooks/is-username-unique";
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

const userCreateSchema = Joi.object().keys({
  username: Joi.string().min(3).max(64).required(),
  password: Joi.string().min(3).max(64).required(),
});

export default {
  before: {
    all: [],
    find: [authenticate("jwt")],
    get: [authenticate("jwt")],
    create: [
      validate.form(userCreateSchema),
      hashPassword("password"),
      isUsernameUnique(),
    ],
    update: [disallow("rest")],
    patch: [
      validate.form(userCreateSchema),
      hashPassword("password"),
      authenticate("jwt"),
      isUsernameUnique(),
    ],
    remove: [disallow("rest"), authenticate("jwt")],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect("password"),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
