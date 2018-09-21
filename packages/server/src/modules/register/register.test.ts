import { Connection } from "typeorm";

import { User } from "../../entity/User";
import { duplicateEmail, invalidEmail, shortPassword } from "./errorMessages";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { TestClient } from "../../utils/TestClient";

const email = "tom@bob.com";
const password = "password";

let conn: Connection;

describe("Register user", async () => {
  beforeAll(async () => {
    conn = await createTypeormConn();
  });

  afterAll(async () => {
    await conn.close();
  });

  test("make sure we can register a user", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const response = await client.register(email, password);
    expect(response.data).toEqual({ register: null });

    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);

    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    // test for duplicate emails
    const response2 = await client.register(email, password);
    expect(response2.data.register).toHaveLength(1);
    expect(response2.data.register[0].message).toBe(duplicateEmail);
  });

  test("catch bad email", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const response3 = await client.register("emailemail.com", password);

    expect(response3.data.register).toHaveLength(1);
    expect(response3.data.register[0].message).toBe(invalidEmail);
  });

  test("catch bad password", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const response4 = await client.register(email, "ab");

    expect(response4.data.register).toHaveLength(1);
    expect(response4.data.register[0].message).toBe(shortPassword);
  });
});
