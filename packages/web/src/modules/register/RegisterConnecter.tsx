import * as React from "react";
import { RegisterView } from "./ui/RegisterView";

// export const RegisterConnecter = () => <RegisterView submit={} />;

export class RegisterConnector extends React.PureComponent {
  dummySubmit = async (values: any) => {
    console.log(values);
    return null;
  };

  render() {
    return <RegisterView submit={this.dummySubmit} />;
  }
}
