import { Connection } from "typeorm";
import * as Redis from "ioredis";
import * as faker from "faker";
import { shortPassword } from "@airbnb-clone/common";

import { createTestConn } from "../../../testUtils/createTestConn";
import { User } from "../../../entity/User";
import { TestClient } from "../../../utils/TestClient";
import { createForgotPasswordLink } from "../../../utils/createForgotPasswordLink";
import { forgotPasswordLockedError } from "../login/errorMessages";
import { forgotPasswordLockAccount } from "../../../utils/forgotPasswordLockAccount";
import { expiredKeyError } from "./errorMessages";

describe("forgot password", () => {
  faker.seed(Date.now() + 0);
  const email = faker.internet.email();
  const password = faker.internet.password();
  const newPassword = faker.internet.password();
  const redis = new Redis();
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

  test("make sure it works", async () => {
    const client = new TestClient(process.env.TEST_HOST as string);

    await forgotPasswordLockAccount(userId, redis);
    const url = await createForgotPasswordLink("", userId, redis);
    const parts = url.split("/");
    const key = parts[parts.length - 1];

    expect(await client.login(email, password)).toEqual({
      data: {
        login: [
          {
            path: "email",
            message: forgotPasswordLockedError
          }
        ]
      }
    });

    expect(await client.forgotPasswordChange("a", key)).toEqual({
      data: {
        forgotPasswordChange: [
          {
            path: "newPassword",
            message: shortPassword
          }
        ]
      }
    });

    const response = await client.forgotPasswordChange(newPassword, key);
    expect(response.data).toEqual({
      forgotPasswordChange: null
    });

    expect(await client.forgotPasswordChange("banana", key)).toEqual({
      data: {
        forgotPasswordChange: [
          {
            path: "key",
            message: expiredKeyError
          }
        ]
      }
    });

    expect(await client.login(email, newPassword)).toEqual({
      data: {
        login: null
      }
    });
  });
});
