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
 * @apiDescription Creates a new task on a list.
 *
 * @apiBody {String} name Name of the new list
 * @apiBody {String[]} [editors] User IDs of users who can edit this list
 *
 * @apiParamExample  {json} Request Query Params Example
 * {}
 * @apiParamExample  {json} Request Body Example
 * {
 *    "title": "My task",
 *    "description": "Task description",
 *    ""
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
 *     "_id": "6302667eba8329a75ac85772",
 *     "name": "My list",
 *     "author": "63020cc5cd043158003e8014",
 *     "editors": [
 *         "62fa8b172b9c4256fe0e48a7",
 *         "62fa8b172b9c4256fe0e48a9"
 *     ]
 * }
 */
