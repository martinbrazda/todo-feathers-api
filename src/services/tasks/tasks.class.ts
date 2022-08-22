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
 * @apiBody {Number} list List ID of the list you want to add the task to
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
 * @apiSuccess (200) {String} _id List ID of the new list
 * @apiSuccess (200) {String} name Name of the new list
 * @apiSuccess (200) {String} author Your user ID (since you created it)
 * @apiSuccess (200) {String[]} editors User IDs of editors (empty array by default)
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
