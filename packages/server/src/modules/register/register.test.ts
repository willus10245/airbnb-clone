import { request } from "graphql-request";

import { startServer } from "../../startServer";
import { User } from "../../entity/User";
import { duplicateEmail, invalidEmail, shortPassword } from "./errorResponse";

let host = "";

const email = "bob@bob.com";
const password = "password";

const mutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address() as any;
  host = `http://127.0.0.1:${port}`;
});

test("Register user", async () => {
  // make sure we can register a user
  const response = await request(host, mutation(email, password));
  expect(response).toEqual({ register: null });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);

  // test for duplicate emails
  const response2: any = await request(host, mutation(email, password));
  expect(response2.register).toHaveLength(1);
  expect(response2.register[0].message).toBe(duplicateEmail);

  // catch bad email
  const response3: any = await request(
    host,
    mutation("emailemail.com", password)
  );
  expect(response3.register).toHaveLength(1);
  expect(response3.register[0].message).toBe(invalidEmail);

  // catch bad password
  const response4: any = await request(host, mutation(email, "ab"));
  expect(response4.register).toHaveLength(1);
  expect(response4.register[0].message).toBe(shortPassword);
});
