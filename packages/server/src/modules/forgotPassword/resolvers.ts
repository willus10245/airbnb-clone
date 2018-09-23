import * as bcrypt from "bcryptjs";

import { ResolverMap } from "../../types/graphql-utils";
import { GQL } from "../../types/schema";
import { User } from "../../entity/User";
import { userSessionIdPrefix } from "../../constants";

export const resolvers: ResolverMap = {
  Query: {
    bye3: () => "bye"
  },
  Mutation: {
    sendForgotPasswordEmail: async (
      _,
      { email }: GQL.ILoginOnMutationArguments,
      { session, redis, req }
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
      if (req.sessionID) {
        await redis.lpush(`${userSessionIdPrefix}${user.id}`, req.sessionID);
      }

      return null;
    }
  }
};
