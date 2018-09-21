import { request } from "graphql-request";
import { Connection } from "typeorm";

import { User } from "../../entity/User";
import { duplicateEmail, invalidEmail, shortPassword } from "./errorMessages";
import { createTypeormConn } from "../../utils/createTypeormConn";

const email = "tom@bob.com";
const password = "password";

const mutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

let conn: Connection;

describe("Register user", async () => {
  beforeAll(async () => {
    conn = await createTypeormConn();
  });

  afterAll(async () => {
    await conn.close();
  });

  test("make sure we can register a user", async () => {
    const response = await request(
      process.env.TEST_HOST as string,
      mutation(email, password)
    );
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    // test for duplicate emails
    const response2: any = await request(
      process.env.TEST_HOST as string,
      mutation(email, password)
    );
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0].message).toBe(duplicateEmail);
  });

  test("catch bad email", async () => {
    const response3: any = await request(
      process.env.TEST_HOST as string,
      mutation("emailemail.com", password)
    );
    expect(response3.register).toHaveLength(1);
    expect(response3.register[0].message).toBe(invalidEmail);
  });

  test("catch bad password", async () => {
    const response4: any = await request(
      process.env.TEST_HOST as string,
      mutation(email, "ab")
    );
    expect(response4.register).toHaveLength(1);
    expect(response4.register[0].message).toBe(shortPassword);
  });
});
