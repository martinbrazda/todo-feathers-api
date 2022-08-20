import assert from "assert";
import { ObjectId } from "mongodb";
import app from "../../src/app";

let userI = 0;
async function createTestUser() {
  const user: any = await app.service("users").create({
    username: `test_user_${userI}_${new Date().getTime()}`,
    password: "notimportant"
  });
  userI++;
  return user;
}

describe("'lists' service", () => {
  it("registered the service", () => {
    const service = app.service("lists");

    assert.ok(service, "Registered the service");
  });

  it("creates a list", async () => {
    const user = await createTestUser();

    const createdList: any = await app.service("lists").create({
      name: "Test list",
      editors: [],
    }, { user });

    assert.equal(createdList?.name, "Test list");
    assert.ok(createdList?.author.equals(user._id)); // Comparing two objectIds
    assert.deepEqual(createdList?.editors, []);
  });

  it("fetches a list", async () => {
    const user = await createTestUser();

    const createdList: any = await app.service("lists").create({
      name: "Test list 2",
      editors: [],
    }, { user });

    const fetchedList = await app.service("lists").get(createdList._id);

    assert.equal(fetchedList?.name, "Test list 2");
    assert.ok(createdList?.author.equals(user._id)); // Comparing two objectIds
    assert.deepEqual(createdList?.editors, []);
  });

  it("fetches all lists of a user", async () => {
    const user = await createTestUser();

    const createdListIds: Array<ObjectId> = [];

    for (const i of [1,2,3,4,5]) {
      const createdList:any = await app.service("lists").create({
        name: "Test list #" + i,
        editors: [],
      }, { user });
      createdListIds.push(createdList._id);
    }

    const fetchedLists: any = await app.service("lists").find({query: {author: user._id}});

    for (const list of fetchedLists.data) {
      assert.ok(list?.author.equals(user._id));
    }

    assert.equal(fetchedLists.total, 5);
  });

  it("patches a list", async () => {
    const user = await createTestUser();

    const createdList: any = await app.service("lists").create({
      name: "Test list",
      editors: [],
    }, { user });

    createdList.name = "Patched list";

    const updatedList: any = await app.service("lists").patch(createdList._id, createdList, { user });
    const fetchedList: any = await app.service("lists").get(createdList._id);

    assert.deepEqual(updatedList, fetchedList);
    assert.equal(fetchedList.name, "Patched list");
  });

  it("removes a list and get list method rejects", async () => {
    const user = await createTestUser();

    const createdList: any = await app.service("lists").create({
      name: "Test list",
      editors: [],
    }, { user });

    await app.service("lists").remove(createdList._id, { user });

    assert.rejects(async ()=> {
      await app.service("lists").get(createdList._id);
    }, {
      name: "NotFound"
    });
  });

  it("cannot create list without being authenticated", async () => {
    assert.rejects(async ()=> {
      await app.service("lists").create({
        name: "Test list",
        editors: [],
      });
    });
  });

  it("cannot update list without being authenticated", async () => {
    const user = await createTestUser();

    const createdList: any = await app.service("lists").create({
      name: "Test list",
      editors: [],
    }, { user });

    createdList.name = "Patched list";

    assert.rejects(async ()=> {
      await app.service("lists").patch(createdList._id, createdList);
    });
  });

  it("cannot remove list without being authenticated", async () => {
    const user = await createTestUser();

    const createdList: any = await app.service("lists").create({
      name: "Test list",
      editors: [],
    }, { user });

    assert.rejects(async ()=> {
      await app.service("lists").remove(createdList._id);
    });
  });

  it("cannot update or remove list without being author or editor", async () => {
    const user = await createTestUser();
    const user2 = await createTestUser();

    const createdList: any = await app.service("lists").create({
      name: "Test list",
      editors: [],
    }, { user });

    createdList.name = "Patched list";

    assert.rejects(async ()=> {
      await app.service("lists").patch(createdList._id, createdList, { user: user2 });
    });
    assert.rejects(async ()=> {
      await app.service("lists").remove(createdList._id, { user: user2 });
    });
  });

  it("can update or remove list if the second user is editor of that list", async () => {
    const user = await createTestUser();
    const user2 = await createTestUser();

    const createdList: any = await app.service("lists").create({
      name: "Test list",
      editors: [user2._id],
    }, { user });

    createdList.name = "Patched list";

    await app.service("lists").patch(createdList._id, createdList, { user: user2 });
    const patchedList: any = await app.service("lists").get(createdList._id);

    assert.equal(patchedList.name, "Patched list");

    await app.service("lists").remove(createdList._id, { user: user2 });

    assert.rejects(async ()=> {
      await app.service("lists").get(createdList._id);
    }, {
      name: "NotFound"
    });
  });




});
