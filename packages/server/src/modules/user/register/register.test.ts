import { Connection } from "typeorm";
import * as faker from "faker";
import { invalidEmail, shortPassword } from "@airbnb-clone/common";

import { User } from "../../../entity/User";
import { duplicateEmail } from "./errorMessages";
import { createTestConn } from "../../../testUtils/createTestConn";
import { TestClient } from "../../../utils/TestClient";

faker.seed(Date.now() + 5);
const email = faker.internet.email();
const password = faker.internet.password();

let conn: Connection;

describe("Register user", async () => {
  beforeAll(async () => {
    conn = await createTestConn();
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
