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
