import { HooksObject } from "@feathersjs/feathers";
import * as authentication from "@feathersjs/authentication";
import { disallow } from "feathers-hooks-common";
import isListEditor from "../../hooks/is-list-editor";
import validateId from "../../hooks/validate-id";
import Joi from "joi";

import validate from "feathers-validate-joi";
import { ObjectId } from "mongodb";
import sanitizeListQuery from "../../hooks/sanitize-list-query";
import hasUserInParams from "../../hooks/has-user-in-params";
import makeObjectid from "../../hooks/make-objectid";
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const listCreateSchema = Joi.object().keys({
  name: Joi.string().max(64).required(),
  editors: Joi.array().custom((values, helper) => {
    for (const value of values) {
      if (!ObjectId.isValid(value)) {
        return helper.message({custom: value + " is not a valid object ID"});
      }
    }

    return values; // All the values in the array were checked, continue
  })
});
const listPatchSchema = Joi.object().keys({
  name: Joi.string().max(64),
  editors: Joi.array().custom((values, helper) => {
    for (const value of values) {
      if (!ObjectId.isValid(value)) {
        return helper.message({custom: value + " is not a valid object ID"});
      }
    }

    return values; // All the values in the array were checked, continue
  })
});


export default {
  before: {
    all: [sanitizeListQuery()],
    find: [],
    get: [validateId()],
    create: [
      authenticate("jwt"),
      validate.form(listCreateSchema),
      hasUserInParams(),
      makeObjectid({type: "data", key: "editors"})
    ],
    update: [disallow("rest")],
    patch: [
      authenticate("jwt"),
      validateId(),
      validate.form(listPatchSchema),
      isListEditor(),
      hasUserInParams(),
      makeObjectid({type: "data", key: "editors"})
    ],
    remove: [authenticate("jwt"), validateId(), isListEditor(), hasUserInParams()],
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
