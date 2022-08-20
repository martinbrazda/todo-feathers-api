import { Db, ObjectId } from "mongodb";
import { Service, MongoDBServiceOptions } from "feathers-mongodb";
import { Application } from "../../declarations";
import { Id, NullableId, Paginated, Params } from "@feathersjs/feathers";

interface ListData {
  _id?: ObjectId; // id not in input params, but will be created by mongo
  name: string;
  author?: ObjectId;
  editors: ObjectId[];
}

export class Lists extends Service<ListData> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options);

    const client: Promise<Db> = app.get("mongoClient");

    client.then((db) => {
      this.Model = db.collection("lists");
    });
  }

  async create(data: ListData, params?: Params | undefined) {
    return super.create({
      name: data.name,
      author: params?.user?._id,
      editors: data.editors || [],
    }, params);
  }

  find(params?: Params | undefined): Promise<ListData[] | Paginated<ListData>> {
    if (params?.query?.author) {
      params.query.author = new ObjectId(params.query.author);
    }
    console.log(params);
    return super.find(params);
  }

  get(id: Id, params?: Params | undefined): Promise<ListData> {
    return super.get(id, params);
  }

  patch(id: NullableId, data: Partial<ListData>, params?: Params | undefined): Promise<ListData | ListData[]> {
    return super.patch(id, data, params);
  }
}
