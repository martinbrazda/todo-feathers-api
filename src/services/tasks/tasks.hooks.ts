import * as authentication from "@feathersjs/authentication";
import { disallow } from "feathers-hooks-common";
import hasUserInParams from "../../hooks/has-user-in-params";
import isTaskEditor from "../../hooks/is-task-editor";
import makeObjectid from "../../hooks/make-objectid";
import Joi from "joi";
import validate from "feathers-validate-joi";
import { ObjectId } from "mongodb";
import sanitizeTaskQuery from "../../hooks/sanitize-task-query";
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const isObjectId = (value: any, helper: any) => {
  if (!ObjectId.isValid(value)) {
    return helper.message({custom: value + " is not a valid object ID"});
  }
  return value;
};
const isTaskFlag = (value: any, helper: any) => {
  if (![0, 1, 2, 3].includes(value)) {
    return helper.message({custom: "Flag value must be a number from 0 to 3"});
  }
  return value;
};

const taskCreateSchema = Joi.object().keys({
  title: Joi.string().max(128).required(),
  description: Joi.string(),
  deadline: Joi.date(),
  flag: Joi.number().custom(isTaskFlag),
  list: Joi.custom(isObjectId).required(),
});
const taskUpdateSchema = Joi.object().keys({
  title: Joi.string().max(128),
  description: Joi.string(),
  deadline: Joi.date(),
  flag: Joi.number().custom(isTaskFlag)
});

export default {
  before: {
    all: [sanitizeTaskQuery()],
    find: [makeObjectid({ type: "query", key: "list" }), makeObjectid({ type: "query", key: "author" })],
    get: [],
    create: [
      authenticate("jwt"),
      hasUserInParams(),
      validate.form(taskCreateSchema),
      isTaskEditor(),
      makeObjectid({ type: "data", key: "list" }),
    ],
    update: [disallow("rest")],
    patch: [
      authenticate("jwt"),
      hasUserInParams(),
      validate.form(taskUpdateSchema),
      isTaskEditor(),
      makeObjectid({ type: "data", key: "list" }),
    ],
    remove: [authenticate("jwt"), hasUserInParams(), isTaskEditor()],
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
