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
