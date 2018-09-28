import * as React from "react";
import { Form, Icon, Button } from "antd";
import {
  withFormik,
  Field,
  FormikErrors,
  FormikProps,
  Form as FForm
} from "formik";

import { validUserSchema } from "@airbnb-clone/common";
import { InputField } from "../../shared/InputField";

const FormItem = Form.Item;

interface FormValues {
  email: string;
  password: string;
}

interface Props {
  submit: (values: FormValues) => Promise<FormikErrors<FormValues> | null>;
}

class C extends React.PureComponent<FormikProps<FormValues> & Props> {
  render() {
    return (
      <FForm style={{ display: "flex" }}>
        <div style={{ width: 400, margin: "auto" }}>
          <Field
            name="email"
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25" }} />}
            placeholder="Email"
            component={InputField}
          />
          <Field
            name="password"
            type="password"
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25" }} />}
            placeholder="Password"
            component={InputField}
          />
          <FormItem>
            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-submit"
            >
              Register
            </Button>
          </FormItem>
          <FormItem>
            Or <a href="">log in</a>
          </FormItem>
        </div>
      </FForm>
    );
  }
}

export const RegisterView = withFormik<Props, FormValues>({
  validationSchema: validUserSchema,
  mapPropsToValues: () => ({ email: "", password: "" }),
  handleSubmit: async (values, { props, setErrors }) => {
    const errors = await props.submit(values);
    if (errors) {
      setErrors(errors);
    }
  }
})(C);
