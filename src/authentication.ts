import { ServiceAddons } from "@feathersjs/feathers";
import { AuthenticationService, JWTStrategy } from "@feathersjs/authentication";
import { LocalStrategy } from "@feathersjs/authentication-local";
import { expressOauth } from "@feathersjs/authentication-oauth";

import { Application } from "./declarations";

declare module "./declarations" {
  interface ServiceTypes {
    "authentication": AuthenticationService & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  const authentication = new AuthenticationService(app);

  authentication.register("jwt", new JWTStrategy());
  authentication.register("local", new LocalStrategy());

  app.use("/authentication", authentication);
  app.configure(expressOauth());
}

/**
 *
 * @api {post} /authentication Authenticate
 * @apiName Authenticate
 * @apiGroup Authentication
 * @apiDescription Authenticates a user
 *
 * @apiBody {String} strategy Just enter "local"
 * @apiBody {String} username Your username
 * @apiBody {String} password Your password
 *
 * @apiParamExample  {json} Request Query Params Example
 * {}
 * @apiParamExample  {json} Request Body Example
 * {
 *    "strategy": "local"
 *    "username": "john",
 *    "password": "password123"
 * }
 *
 * @apiSuccess (200) {String} accessToken Access token you use to authenticate in the header "Authorization: Bearer xxx", where xxx is your accessToken
 * @apiSuccess (200) {Object} authentication Various data about the token
 * @apiSuccess (200) {Object} user Your user object
 *
 * @apiSuccessExample {json} Success Response
 * 200 OK
 * {
 *     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJpYXQiOjE2NjExNzg2NTksImV4cCI6MTY2MTI2NTA1OSwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiNjMwMzhlYTBkOWViMzQzZTZjZDRjMmJiIiwianRpIjoiNjY0ZGIxNDktNTVjZC00ZDQ2LTgyNmUtZjhjMzJhZmFiOWQ2In0.P0hN21PIzBUm-NDVFIOT3eqnIQ5uS714nGxzmdlxI7Q",
 *     "authentication": {
 *         "strategy": "local",
 *         "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJpYXQiOjE2NjExNzg2NTksImV4cCI6MTY2MTI2NTA1OSwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiNjMwMzhlYTBkOWViMzQzZTZjZDRjMmJiIiwianRpIjoiNjY0ZGIxNDktNTVjZC00ZDQ2LTgyNmUtZjhjMzJhZmFiOWQ2In0.P0hN21PIzBUm-NDVFIOT3eqnIQ5uS714nGxzmdlxI7Q",
 *         "payload": {
 *             "iat": 1661178659,
 *             "exp": 1661265059,
 *             "aud": "https://yourdomain.com",
 *             "iss": "feathers",
 *             "sub": "63038ea0d9eb343e6cd4c2bb",
 *             "jti": "664db149-55cd-4d46-826e-f8c32afab9d6"
 *         }
 *     },
 *     "user": {
 *         "_id": "63038ea0d9eb343e6cd4c2bb",
 *         "username": "john"
 *     }
 * }
 */
