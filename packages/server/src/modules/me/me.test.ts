import { Connection } from "typeorm";
import * as faker from "faker";

import { createTestConn } from "../../testUtils/createTestConn";
import { User } from "../../entity/User";
import { TestClient } from "../../utils/TestClient";

const email = faker.internet.email();
const password = faker.internet.password();
let conn: Connection;
let userId: string;

describe("me", () => {
  beforeAll(async () => {
    conn = await createTestConn();
    const user = await User.create({
      email,
      password,
      confirmed: true
    }).save();
    userId = user.id;
  });

  afterAll(async () => {
    conn.close();
  });

  test("return null if no cookie", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);

    const response = await client.me();

    expect(response.data.me).toBeNull();
  });

  test("get current user", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    await client.login(email, password);

    const response = await client.me();

    expect(response.data).toEqual({
      me: {
        email,
        id: userId
      }
    });
  });
});
