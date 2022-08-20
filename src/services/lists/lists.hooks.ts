import { HooksObject } from "@feathersjs/feathers";
import * as authentication from "@feathersjs/authentication";
import isListEditor from "../../hooks/is-list-editor";
import validateId from "../../hooks/validate-id";
import Joi from "joi";

import validate from "feathers-validate-joi";
import { ObjectId } from "mongodb";
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

// const listSchema = Joi.object().keys({
//   name: Joi.string().max(64).required(),
//   editors: Joi.array().custom((values, helper) => {
//     for (const value of values) {
//       if (ObjectId.isValid(value)) {
//         return true;
//       } else {
//         return helper.error(value + " is not a valid object ID");
//       }
//     }
//   })
// });


export default {
  before: {
    all: [],
    find: [],
    get: [validateId()],
    create: [authenticate("jwt")],
    update: [authenticate("jwt")],
    patch: [authenticate("jwt"), validateId(), isListEditor()],
    remove: [authenticate("jwt"), validateId(), isListEditor()],
  },

  after: {
    all: [],
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
