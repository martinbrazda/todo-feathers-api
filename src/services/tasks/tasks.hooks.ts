import { HooksObject } from "@feathersjs/feathers";
import * as authentication from "@feathersjs/authentication";
import { disallow } from "feathers-hooks-common";
import hasUserInParams from "../../hooks/has-user-in-params";
import isTaskEditor from "../../hooks/is-task-editor";
import makeObjectid from "../../hooks/make-objectid";
import Joi, { valid } from "joi";
import validate from "feathers-validate-joi";
import { ObjectId } from "mongodb";
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
  flag: Joi.number().custom(isTaskFlag),
  list: Joi.custom(isObjectId)
});

export default {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [
      hasUserInParams(),
      validate.form(taskCreateSchema),
      isTaskEditor(),
      makeObjectid({ type: "data", key: "list" }),
    ],
    update: [disallow("rest")],
    patch: [
      hasUserInParams(),
      validate.form(taskUpdateSchema),
      isTaskEditor(),
      makeObjectid({ type: "data", key: "list" }),
    ],
    remove: [hasUserInParams(), isTaskEditor()],
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
