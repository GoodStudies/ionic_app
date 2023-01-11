import { Redirect, Route } from "react-router";

interface Props {
  path: string;
  component: any;
  auth: boolean;
}

const GuardedRoute: React.FC<Props> = ({
  path,
  component: Component,
  auth,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        auth == true ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default GuardedRoute;
