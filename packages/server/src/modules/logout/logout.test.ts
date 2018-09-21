import axios from "axios";
import { Connection } from "typeorm";

import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../entity/User";

describe("logout", () => {
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

  const logoutMutation = `
    mutation {
      logout
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

  test("logging out a user", async () => {
    await axios.post(
      process.env.TEST_HOST as string,
      { query: loginMutation(email, password) },
      { withCredentials: true }
    );

    const response = await axios.post(
      process.env.TEST_HOST as string,
      { query: meQuery },
      { withCredentials: true }
    );

    expect(response.data.data).toEqual({
      me: {
        email,
        id: userId
      }
    });

    await axios.post(
      process.env.TEST_HOST as string,
      { query: logoutMutation },
      { withCredentials: true }
    );

    const response2 = await axios.post(
      process.env.TEST_HOST as string,
      { query: meQuery },
      { withCredentials: true }
    );

    expect(response2.data.data.me).toBeNull();
  });
});
