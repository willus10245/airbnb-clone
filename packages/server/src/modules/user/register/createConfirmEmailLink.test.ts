import fetch from "node-fetch";
import { Connection } from "typeorm";
import * as faker from "faker";

import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { createTestConn } from "../../../testUtils/createTestConn";
import { User } from "../../../entity/User";
import { redis } from "../../../redis";

let userId = "";

let conn: Connection;

beforeAll(async () => {
  faker.seed(Date.now() + 4);
  conn = await createTestConn();
  const user = await User.create({
    email: faker.internet.email(),
    password: faker.internet.password()
  }).save();
  userId = user.id;
});

afterAll(async () => {
  conn.close();
});

test("createConfirmEmailLink should confirm user and clear key in redis", async () => {
  const url = await createConfirmEmailLink(
    process.env.TEST_HOST as string,
    userId,
    redis
  );

  const response = await fetch(url);
  const text = await response.text();
  expect(text).toBe("ok");

  const user = await User.findOne({ where: { id: userId } });
  expect((user as User).confirmed).toBeTruthy();

  const chunks = url.split("/");
  const key = chunks[chunks.length - 1];
  const value = await redis.get(key);
  expect(value).toBeNull();
});
