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
    return super.create(
      {
        name: data.name,
        author: params?.user?._id,
        editors: data.editors || [],
      },
      params
    );
  }

  find(params?: Params | undefined): Promise<ListData[] | Paginated<ListData>> {
    // console.log(params);
    return super.find(params);
  }

  get(id: Id, params?: Params | undefined): Promise<ListData> {
    return super.get(id, params);
  }

  patch(
    id: NullableId,
    data: Partial<ListData>,
    params?: Params | undefined
  ): Promise<ListData | ListData[]> {
    return super.patch(id, data, params);
  }
}

/**
 *
 * @api {post} /lists [AUTH] Create a list
 * @apiName ListsCreate
 * @apiGroup Lists
 * @apiDescription Creates a new list.
 *
 * @apiBody {String} name Name of the new list
 * @apiBody {String[]} [editors] User IDs of users who can edit this list
 *
 * @apiParamExample  {json} Request Query Params Example
 * {}
 * @apiParamExample  {json} Request Body Example
 * {
 *    "name": "My list",
 *    "editors": ["62fa8b172b9c4256fe0e48a7", "62fa8b172b9c4256fe0e48a9"]
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

/**
 *
 * @api {get} /lists/:id Get a list
 * @apiName ListsGet
 * @apiGroup Lists
 * @apiDescription Gets a list by its ID.
 *
 * @apiParam {String} id ID of the list you want
 *
 * @apiParamExample  {json} Request Query Params Example
 * {
 *  "id": "6302667eba8329a75ac85772"
 * }
 * @apiParamExample  {json} Request Body Example
 * {}
 *
 * @apiSuccess (200) {String} _id List ID of the list
 * @apiSuccess (200) {String} name Name of the list
 * @apiSuccess (200) {String} author Author user ID
 * @apiSuccess (200) {String[]} editors User IDs of editors
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

/**
 *
 * @api {get} /lists?author=:user_id Get lists by author
 * @apiName ListsFindAuthor
 * @apiGroup Lists
 * @apiDescription Get lists by author.
 *
 * @apiParam {String} user_id ID of the user
 *
 * @apiParamExample  {json} Request Query Params Example
 * {
 *  "user_id": "63020cc5cd043158003e8014"
 * }
 * @apiParamExample  {json} Request Body Example
 * {}
 *
 * @apiSuccess (200) {Number} total Number of total entries
 * @apiSuccess (200) {Number} limit Entries per page
 * @apiSuccess (200) {Number} skip How many entries were skipped
 * @apiSuccess (200) {Array} data Array of lists - for list data reference see "Get a list" endpoint docs
 *
 * @apiSuccessExample {json} Success Response
 * 200 OK
 * {
 *   "total": 2,
 *   "limit": 10,
 *   "skip": 0,
 *   "data": [
 *     {
 *       "_id": "630224e8aed04dfbecea28ea",
 *       "name": "list",
 *       "author": "63020cc5cd043158003e8014",
 *       "editors": [
 *         "63020cd9cd043158003e8015"
 *       ]
 *     },
 *     {
 *       "_id": "63022ba0691b580b1cad32f3",
 *       "name": "list 2",
 *       "author": "63020cc5cd043158003e8014",
 *       "editors": [
 *         "63020cd9cd043158003e8015"
 *       ]
 *     }
 *   ]
 * }
 */

/**
 *
 * @api {get} /lists?editors=:user_id Get lists by editor
 * @apiName ListsFindEditor
 * @apiGroup Lists
 * @apiDescription Get lists where the user is an editor.
 *
 * @apiParam {String} user_id ID of the user
 *
 * @apiParamExample  {json} Request Query Params Example
 * {
 *  "user_id": "63020cd9cd043158003e8015"
 * }
 * @apiParamExample  {json} Request Body Example
 * {}
 *
 * @apiSuccess (200) {Number} total Number of total entries
 * @apiSuccess (200) {Number} limit Entries per page
 * @apiSuccess (200) {Number} skip How many entries were skipped
 * @apiSuccess (200) {Array} data Array of lists - for list data reference see "Get a list" endpoint docs
 *
 * @apiSuccessExample {json} Success Response
 * 200 OK
 * {
 *   "total": 2,
 *   "limit": 10,
 *   "skip": 0,
 *   "data": [
 *     {
 *       "_id": "630224e8aed04dfbecea28ea",
 *       "name": "list",
 *       "author": "63020cc5cd043158003e8014",
 *       "editors": [
 *         "63020cd9cd043158003e8015"
 *       ]
 *     },
 *     {
 *       "_id": "63022ba0691b580b1cad32f3",
 *       "name": "list 2",
 *       "author": "63020cc5cd043158003e8014",
 *       "editors": [
 *         "63020cd9cd043158003e8015"
 *       ]
 *     }
 *   ]
 * }
 */

/**
 *
 * @api {patch} /lists/:id [AUTH] Update a list
 * @apiName ListsPatch
 * @apiGroup Lists
 * @apiDescription Updates details of a list.
 *
 * @apiParam {String} id ID of the list to be updated
 *
 * @apiBody {String} [name] Name of the new list
 * @apiBody {String[]} [editors] User IDs of users who can edit this list
 *
 * @apiParamExample  {json} Request Query Params Example
 * {
 *  "id": "6302667eba8329a75ac85772"
 * }
 * @apiParamExample  {json} Request Body Example
 * {
 *  "name": "My updated list",
 *  "editors": ["62fa8b172b9c4256fe0e48a7"]
 * }
 *
 * @apiSuccess (200) {String} _id List ID of the updated list
 * @apiSuccess (200) {String} name Name of the updated list
 * @apiSuccess (200) {String} author Author of the list
 * @apiSuccess (200) {String[]} editors User IDs of editors
 *
 * @apiSuccessExample {json} Success Response
 * 200 OK
 * {
 *     "_id": "6302667eba8329a75ac85772",
 *     "name": "My updated list",
 *     "author": "63020cc5cd043158003e8014",
 *     "editors": [
 *         "62fa8b172b9c4256fe0e48a7",
 *     ]
 * }
 */

/**
 *
 * @api {delete} /lists/:id [AUTH] Delete a list
 * @apiName ListsDelete
 * @apiGroup Lists
 * @apiDescription Deletes a list.
 *
 * @apiParam {String} id ID of the list to be deleted
 *
 * @apiParamExample  {json} Request Query Params Example
 * {
 *  "id": "6302667eba8329a75ac85772"
 * }
 * @apiParamExample  {json} Request Body Example
 * {}
 *
 * @apiSuccess (200) {String} _id List ID of the deleted list
 * @apiSuccess (200) {String} name Name of the deleted list
 * @apiSuccess (200) {String} author Author of the list
 * @apiSuccess (200) {String[]} editors User IDs of editors
 *
 * @apiSuccessExample {json} Success Response
 * 200 OK
 * {
 *     "_id": "6302667eba8329a75ac85772",
 *     "name": "My list that was deleted just now",
 *     "author": "63020cc5cd043158003e8014",
 *     "editors": [
 *         "62fa8b172b9c4256fe0e48a7",
 *     ]
 * }
 */
