import { Connection } from "typeorm";
import * as faker from "faker";

import { createTestConn } from "../../../testUtils/createTestConn";
import { User } from "../../../entity/User";
import { TestClient } from "../../../utils/TestClient";

describe("logout", () => {
  const email = faker.internet.email();
  const password = faker.internet.password();
  let conn: Connection;
  let userId: string;

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

  test("multiple sessions", async () => {
    const sess1 = new TestClient(process.env.TEST_HOST as string);
    const sess2 = new TestClient(process.env.TEST_HOST as string);

    await sess1.login(email, password);
    await sess2.login(email, password);
    expect(await sess1.me()).toEqual(await sess2.me());

    await sess1.logout();
    expect(await sess1.me()).toEqual(await sess2.me());
  });

  test("single session", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);

    await client.login(email, password);

    const response = await client.me();

    expect(response.data).toEqual({
      me: {
        email,
        id: userId
      }
    });

    await client.logout();

    const response2 = await client.me();

    expect(response2.data.me).toBeNull();
  });
});
