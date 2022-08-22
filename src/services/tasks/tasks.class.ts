import { Db, ObjectId } from "mongodb";
import { Service, MongoDBServiceOptions } from "feathers-mongodb";
import { Application } from "../../declarations";
import { Id, NullableId, Params } from "@feathersjs/feathers";

interface TaskData {
  _id?: ObjectId; // id not in input params, but will be created by mongo
  title: string;
  description?: string;
  deadline?: Date;
  flag?: 0 | 1 | 2 | 3;
  author?: ObjectId;
  list: ObjectId;
}

export class Tasks extends Service<TaskData> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options);

    const client: Promise<Db> = app.get("mongoClient");

    client.then((db) => {
      this.Model = db.collection("tasks");
    });
  }

  create(data: TaskData, params?: Params | undefined): Promise<any> {
    return super.create({
      title: data.title,
      description: data.description || "",
      deadline: data.deadline,
      flag: data.flag || 0,
      author: params?.user?._id,
      list: data.list,
    });
  }

  get(id: Id, params?: Params | undefined): Promise<TaskData> {
    return super.get(id);
  }

  patch(
    id: NullableId,
    data: Partial<TaskData>,
    params?: Params | undefined
  ): Promise<TaskData | TaskData[]> {
    return super.patch(id, data);
  }

  remove(id: NullableId, params?: Params | undefined): Promise<TaskData | TaskData[]> {
    return super.remove(id);
  }
}

/**
 *
 * @api {post} /tasks [AUTH] Create a task
 * @apiName TasksCreate
 * @apiGroup Tasks
 * @apiDescription Creates a new task on a list. You must be author or editor of the list.
 *
 * @apiBody {String} title Title of your new task
 * @apiBody {String} [description] Description of the task (empty string by default)
 * @apiBody {String} [deadline] Date and time of the deadline for this task. Should be in ISO format (null by default)
 * @apiBody {Number} [flag] State of the task. (0-todo (default), 1-current, 2-finished, 3-canceled)
 * @apiBody {String} list List ID of the list you want to add the task to
 *
 * @apiParamExample  {json} Request Query Params Example
 * {}
 * @apiParamExample  {json} Request Body Example
 * {
 *    "title": "My task",
 *    "description": "Task description",
 *    "deadline": "2022-08-22T13:00:00.000Z",
 *    "flag": 1,
 *    "list": "6302667eba8329a75ac85772"
 * }
 *
 * @apiSuccess (200) {String} _id Task ID of the new task
 * @apiSuccess (200) {String} title Title of the task
 * @apiSuccess (200) {String} description Description of the task
 * @apiSuccess (200) {String} deadline Date and time of the task deadline (can be null)
 * @apiSuccess (200) {Number} flag State of the task. (0-todo (default), 1-current, 2-finished, 3-canceled)
 * @apiSuccess (200) {String} author User ID of the user who created the task
 * @apiSuccess (200) {String} list List ID the task belongs to
 *
 * @apiSuccessExample {json} Success Response
 * 200 OK
 * {
 *     "_id": "63022eebe5fd3c880a770b4a",
 *     "title": "My task",
 *     "description": "Task description",
 *     "deadline": "2022-08-22T13:00:00.000Z",
 *     "flag": 1,
 *     "author": "63020cc5cd043158003e8014",
 *     "list": "6302667eba8329a75ac85772"
 * }
 */

/**
 *
 * @api {get} /tasks/:id Get a task
 * @apiName TasksGet
 * @apiGroup Tasks
 * @apiDescription Gets a task by its ID
 *
 * @apiParam {String} id ID of the task
 *
 * @apiParamExample  {json} Request Query Params Example
 * {
 *    "id": "63022eebe5fd3c880a770b4a"
 * }
 * @apiParamExample  {json} Request Body Example
 * {}
 *
 * @apiSuccess (200) {String} _id Task ID of the new task
 * @apiSuccess (200) {String} title Title of the task
 * @apiSuccess (200) {String} description Description of the task
 * @apiSuccess (200) {String} deadline Date and time of the task deadline (can be null)
 * @apiSuccess (200) {Number} flag State of the task. (0-todo (default), 1-current, 2-finished, 3-canceled)
 * @apiSuccess (200) {String} author User ID of the user who created the task
 * @apiSuccess (200) {String} list List ID the task belongs to
 *
 * @apiSuccessExample {json} Success Response
 * 200 OK
 * {
 *     "_id": "63022eebe5fd3c880a770b4a",
 *     "title": "My task",
 *     "description": "Task description",
 *     "deadline": "2022-08-22T13:00:00.000Z",
 *     "flag": 1,
 *     "author": "63020cc5cd043158003e8014",
 *     "list": "6302667eba8329a75ac85772"
 * }
 */

/**
 *
 * @api {get} /tasks?list=:list_id Get all tasks from a list
 * @apiName TasksGetFromList
 * @apiGroup Tasks
 * @apiDescription Gets every task in a list.
 *
 * @apiParam {String} list_id ID of the list you want tasks from
 *
 * @apiParamExample  {json} Request Query Params Example
 * {
 *    "list_id": "6302667eba8329a75ac85772"
 * }
 * @apiParamExample  {json} Request Body Example
 * {}
 *
 * @apiSuccess (200) {Number} total Number of total entries
 * @apiSuccess (200) {Number} limit Entries per page
 * @apiSuccess (200) {Number} skip How many entries were skipped
 * @apiSuccess (200) {Array} data Array of tasks - for task data reference see "Get a task" endpoint docs
 *
 * @apiSuccessExample {json} Success Response
 * 200 OK
 * {
 *   "total": 2,
 *   "limit": 10,
 *   "skip": 0,
 *   "data": [
 *     {
 *         "_id": "63022eebe5fd3c880a770b4a",
 *         "title": "My task",
 *         "description": "Task description",
 *         "deadline": "2022-08-22T13:00:00.000Z",
 *         "flag": 1,
 *         "author": "63020cc5cd043158003e8014",
 *         "list": "6302667eba8329a75ac85772"
 *     },
 *     {
 *         "_id": "63022eebe5fd3c880a770b4b",
 *         "title": "My task 2",
 *         "description": "Task description",
 *         "deadline": null,
 *         "flag": 0,
 *         "author": "63020cc5cd043158003e8014",
 *         "list": "6302667eba8329a75ac85772"
 *     }
 *   ]
 * }
 *
 */

/**
 *
 * @api {patch} /tasks/:id [AUTH] Update a task
 * @apiName TasksUpdate
 * @apiGroup Tasks
 * @apiDescription Updates data of a task. You must be author or editor of the list to edit any task within it.
 *
 * @apiParam {String} id ID of the task
 *
 * @apiBody {String} [title] Title of the task
 * @apiBody {String} [description] Description of the task
 * @apiBody {String} [deadline] Date and time of the deadline for this task. Should be in ISO format (null by default)
 * @apiBody {Number} [flag] State of the task. (0-todo (default), 1-current, 2-finished, 3-canceled)
 *
 * @apiParamExample  {json} Request Query Params Example
 * {
 *  "id": "63022eebe5fd3c880a770b4a"
 * }
 * @apiParamExample  {json} Request Body Example
 * {
 *    "title": "My updated task",
 *    "description": "Updated task description",
 *    "deadline": "2022-09-28T13:00:00.000Z",
 *    "flag": 0
 * }
 *
 * @apiSuccessExample {json} Success Response
 * 200 OK
 * {
 *     "_id": "63022eebe5fd3c880a770b4a",
 *     "title": "My updated task",
 *     "description": "Updated task description",
 *     "deadline": "2022-09-28T13:00:00.000Z",
 *     "flag": 0,
 *     "author": "63020cc5cd043158003e8014",
 *     "list": "6302667eba8329a75ac85772"
 * }
 */

/**
 *
 * @api {delete} /tasks/:id [AUTH] Delete a task
 * @apiName TasksDelete
 * @apiGroup Tasks
 * @apiDescription Deletes a task. You must be author or editor of the list to delete any task within it.
 *
 * @apiParam {String} id ID of the task
 *
 * @apiParamExample  {json} Request Query Params Example
 * {
 *  "id": "63022eebe5fd3c880a770b4a"
 * }
 * @apiParamExample  {json} Request Body Example
 * {}
 *
 * @apiSuccessExample {json} Success Response
 * 200 OK
 * {
 *     "_id": "63022eebe5fd3c880a770b4a",
 *     "title": "My task",
 *     "description": "Task description",
 *     "deadline": "2022-09-28T13:00:00.000Z",
 *     "flag": 0,
 *     "author": "63020cc5cd043158003e8014",
 *     "list": "6302667eba8329a75ac85772"
 * }
 */
