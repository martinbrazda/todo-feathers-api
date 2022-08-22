import { Db } from "mongodb";
import { Service, MongoDBServiceOptions } from "feathers-mongodb";
import { Application } from "../../declarations";
import { Params, Paginated, Id } from "@feathersjs/feathers";

interface UserData {
  _id?: string;
  username: string;
  password: string;
}

export class Users extends Service<UserData> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options);

    const client: Promise<Db> = app.get("mongoClient");

    client.then((db) => {
      this.Model = db.collection("users");
    });
  }

  get(id: Id, params?: Params | undefined): Promise<UserData> {
    return super.get(id);
  }

  create(
    data: UserData,
    params?: Params | undefined
  ): Promise<UserData | UserData[]> {
    return super.create({
      username: data.username,
      password: data.password,
    }, params);
  }
}

/**
 *
 * @api {post} /users Create a user
 * @apiName UsersCreate
 * @apiGroup Users
 * @apiDescription Creates a new user
 *
 * @apiBody {String} username Your username
 * @apiBody {String} password Your password
 *
 * @apiParamExample  {json} Request Query Params Example
 * {}
 * @apiParamExample  {json} Request Body Example
 * {
 *    "username": "john",
 *    "password": "password123"
 * }
 *
 * @apiSuccess (200) {String} _id Task ID of the new user
 * @apiSuccess (200) {String} username Username you entered
 *
 * @apiSuccessExample {json} Success Response
 * 200 OK
 * {
 *     "_id": "63038ea0d9eb343e6cd4c2bb",
 *     "username": "john"
 * }
 */
