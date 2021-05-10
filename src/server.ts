import { validateEnv } from "@core/utils";
import "dotenv/config";
import { IndexRoute } from "@modules/index";
import App from "./app";
import UsersRoute from "@modules/users/user.route";
import AuthRoute from "@modules/auth/auth.route";
import { ProfileRoute } from "@modules/profile";
import { PostRoute } from "@modules/post";

validateEnv();
const routes = [
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new ProfileRoute(),
  new PostRoute(),
];

const app = new App(routes);

app.listen();
