import { Connection } from "typeorm";
import * as faker from "faker";

import { invalidLogin, confirmEmailError } from "./errorMessages";
import { User } from "../../entity/User";
import { createTestConn } from "../../testUtils/createTestConn";
import { TestClient } from "../../utils/TestClient";

const email = faker.internet.email();
const password = faker.internet.password();

let conn: Connection;

describe("login", async () => {
  beforeAll(async () => {
    conn = await createTestConn();
  });

  afterAll(async () => {
    await conn.close();
  });

  test("returns error when logging in without registering first", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const response = await client.login(email, password);

    expect(response.data).toEqual({
      login: [
        {
          path: "email",
          message: invalidLogin
        }
      ]
    });
  });

  test("returns error when email not confirmed", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    await client.register(email, password);
    const response = await client.login(email, password);

    expect(response.data).toEqual({
      login: [
        {
          path: "email",
          message: confirmEmailError
        }
      ]
    });

    await User.update({ email }, { confirmed: true });
  });

  test("bad password", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const response = await client.login(email, "pass");

    expect(response.data).toEqual({
      login: [
        {
          path: "password",
          message: invalidLogin
        }
      ]
    });
  });
});
