import { Connection } from "typeorm";

import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../entity/User";
import { TestClient } from "../../utils/TestClient";

describe("logout", () => {
  const email = "bob5@bob.com";
  const password = "password";
  let conn: Connection;
  let userId: string;

  beforeAll(async () => {
    conn = await createTypeormConn();
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

  test("logging out a user", async () => {
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
