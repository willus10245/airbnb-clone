import * as bcrypt from "bcryptjs";

import { ResolverMap } from "../../types/graphql-utils";
import { GQL } from "../../types/schema";
import { User } from "../../entity/User";
import { invalidLogin, confirmEmailError } from "./errorMessages";

export const resolvers: ResolverMap = {
  Query: {
    bye2: () => "bye"
  },
  Mutation: {
    login: async (
      _,
      { email, password }: GQL.ILoginOnMutationArguments,
      { session }
    ) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return [
          {
            path: "email",
            message: invalidLogin
          }
        ];
      }

      if (!user.confirmed) {
        return [
          {
            path: "email",
            message: confirmEmailError
          }
        ];
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return [
          {
            path: "password",
            message: invalidLogin
          }
        ];
      }

      // login successful
      session.userId = user.id;

      return null;
    }
  }
};