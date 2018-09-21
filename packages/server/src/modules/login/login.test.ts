import { Connection } from "typeorm";

import { invalidLogin, confirmEmailError } from "./errorMessages";
import { User } from "../../entity/User";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { TestClient } from "../../utils/TestClient";

const email = "jim@bob.com";
const password = "password";

let conn: Connection;

describe("login", async () => {
  beforeAll(async () => {
    conn = await createTypeormConn();
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
