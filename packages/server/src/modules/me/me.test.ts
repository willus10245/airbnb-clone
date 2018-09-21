import axios from "axios";
import { Connection } from "typeorm";

import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../entity/User";

describe("me", () => {
  const email = "bob5@bob.com";
  const password = "password";
  let conn: Connection;
  let userId: string;

  const loginMutation = (e: string, p: string) => `
    mutation {
      login(email: "${e}", password: "${p}") {
        path
        message
      }
    }
  `;

  const meQuery = `
    {
      me {
        id
        email
      }
    }
  `;

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

  test("return null if no cookie", async () => {
    const response = await axios.post(process.env.TEST_HOST as string, {
      query: meQuery
    });

    expect(response.data.data.me).toBeNull();
  });

  test("get current user", async () => {
    await axios.post(
      process.env.TEST_HOST as string,
      {
        query: loginMutation(email, password)
      },
      {
        withCredentials: true
      }
    );

    const response = await axios.post(
      process.env.TEST_HOST as string,
      {
        query: meQuery
      },
      {
        withCredentials: true
      }
    );

    expect(response.data.data).toEqual({
      me: {
        email,
        id: userId
      }
    });
  });
});
