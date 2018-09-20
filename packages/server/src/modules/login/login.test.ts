import { request } from "graphql-request";
import { Connection } from "typeorm";

import { invalidLogin, confirmEmailError } from "./errorMessages";
import { User } from "../../entity/User";
import { createTypeormConn } from "../../utils/createTypeormConn";

const email = "jim@bob.com";
const password = "password";

const registerMutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

const loginMutation = (e: string, p: string) => `
  mutation {
    login(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

let conn: Connection;

describe("login", async () => {
  beforeAll(async () => {
    conn = await createTypeormConn();
  });

  afterAll(async () => {
    await conn.close();
  });

  test("returns error when logging in without registering first", async () => {
    const response = await request(
      process.env.TEST_HOST as string,
      loginMutation("bob@bob.com", "password")
    );

    expect(response).toEqual({
      login: [
        {
          path: "email",
          message: invalidLogin
        }
      ]
    });
  });

  test("returns error when email not confirmed", async () => {
    await request(
      process.env.TEST_HOST as string,
      registerMutation(email, password)
    );

    const response = await request(
      process.env.TEST_HOST as string,
      loginMutation(email, password)
    );

    expect(response).toEqual({
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
    const response = await request(
      process.env.TEST_HOST as string,
      loginMutation(email, "pass")
    );

    expect(response).toEqual({
      login: [
        {
          path: "password",
          message: invalidLogin
        }
      ]
    });
  });
});
