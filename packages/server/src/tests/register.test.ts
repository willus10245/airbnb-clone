import { request } from "graphql-request";

import { host } from "./constants";
import { User } from "../entity/User";
import { createTypeormConn } from "../utils/createTypeormConn";

const email = "bob@bob.com";
const password = "password";

const mutation = `
  mutation {
    register(email: "${email}", password: "${password}")
  }
`;

beforeAll(async () => {
  await createTypeormConn();
});

test("Register user", async () => {
  const response = await request(host, mutation);
  expect(response).toEqual({ register: true });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});

// use a test db
// drop all data once test is over
// when i run yarn test, it also starts server
