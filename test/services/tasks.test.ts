import assert from "assert";
import { ObjectId } from "mongodb";
import app from "../../src/app";

let userI = 0;
async function createTestUser() {
  const user: any = await app.service("users").create({
    username: `test_user_${userI}_${new Date().getTime()}`,
    password: "notimportant",
  });
  userI++;
  return user;
}

let listI = 0;
async function createTestList(user: any) {
  const list: any = await app.service("lists").create(
    {
      name: `test_list_${listI}_${new Date().getTime()}`,
      editors: [],
    },
    { user }
  );
  listI++;
  return list;
}

let taskI = 0;
async function createTestTask(user: any, listId: ObjectId) {
  const task: any = await app.service("tasks").create(
    {
      title: `test_task_${taskI}_${new Date().getTime()}`,
      list: listId,
    },
    { user }
  );
  taskI++;
  return task;
}

describe("'tasks' service", () => {
  it("registered the service", () => {
    const service = app.service("tasks");

    assert.ok(service, "Registered the service");
  });

  it("creates and gets task", async () => {
    const user = await createTestUser();
    const list = await createTestList(user);

    const taskData = {
      title: "Test task",
      description: "Test description",
      deadline: new Date(),
      flag: 2 as 0 | 1 | 2 | 3, // typescript.
      list: list._id,
    };

    const task = await app.service("tasks").create(taskData, { user });

    const fetchedTask = await app.service("tasks").get(task._id);

    assert.ok(fetchedTask.author?.equals(user._id));
    assert.equal(fetchedTask.title, taskData.title);
    assert.equal(fetchedTask.description, taskData.description);
    assert.deepEqual(fetchedTask.deadline, taskData.deadline);
    assert.equal(fetchedTask.flag, taskData.flag);
    assert.ok(fetchedTask.list?.equals(taskData.list));
  });

  it("creates task with just the title and list", async () => {
    const user = await createTestUser();
    const list = await createTestList(user);

    const taskData = {
      title: "Test task",
      list: list._id,
    };

    const task = await app.service("tasks").create(taskData, { user });

    const fetchedTask = await app.service("tasks").get(task._id);

    // These should be as entered
    assert.ok(fetchedTask.author?.equals(user._id));
    assert.ok(fetchedTask.list?.equals(taskData.list));
    assert.equal(fetchedTask.title, taskData.title);

    // These should be default
    assert.equal(fetchedTask.description, "");
    assert.equal(fetchedTask.deadline, undefined);
    assert.equal(fetchedTask.flag, 0);
  });

  it("creates task and updates it", async () => {
    const user = await createTestUser();
    const list = await createTestList(user);
    const task = await createTestTask(user, list._id);

    const newTaskData = {
      title: "Test task",
      description: "Test description",
      deadline: new Date(),
      flag: 2 as 0 | 1 | 2 | 3, // typescript.
    };

    await app.service("tasks").patch(task._id, newTaskData, { user });

    const fetchedTask = await app.service("tasks").get(task._id);

    assert.ok(fetchedTask.author?.equals(user._id));
    assert.equal(fetchedTask.title, newTaskData.title);
    assert.equal(fetchedTask.description, newTaskData.description);
    assert.deepEqual(fetchedTask.deadline, newTaskData.deadline);
    assert.equal(fetchedTask.flag, newTaskData.flag);
  });

  it("creates task and deletes it and get method rejects", async () => {
    const user = await createTestUser();
    const list = await createTestList(user);
    const task = await createTestTask(user, list._id);

    await app.service("tasks").get(task._id); // Should not throw since it should exist

    await app.service("tasks").remove(task._id, { user });

    assert.rejects(
      async () => {
        await app.service("tasks").get(task._id);
      },
      {
        name: "NotFound",
      }
    );
  });

  it("cannot create task if not author or editor of the list", async () => {
    const user = await createTestUser();
    const user2 = await createTestUser();
    const list = await createTestList(user);

    assert.rejects(async () => {
      await createTestTask(user2, list._id);
    });
  });

  it("can create task if editor of the list", async () => {
    const user = await createTestUser();
    const user2 = await createTestUser();
    const list = await createTestList(user);

    // User 1 now adds user 2 to the editors array, so user 2 can add a task
    await app.service("lists").patch(list._id, {editors: [user2._id]}, {user});

    await createTestTask(user2, list._id);
  });

  it("can delete task of other user if editor of the list", async () => {
    const user = await createTestUser();
    const user2 = await createTestUser();
    const list = await createTestList(user);

    await app.service("lists").patch(list._id, {editors: [user2._id]}, {user});

    const task = await createTestTask(user, list._id);

    await app.service("tasks").remove(task._id, { user: user2 });
  });
});
