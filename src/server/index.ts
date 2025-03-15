import { j } from "./jstack";
import { postRouter } from "./routers/post-router";
import { todoListRouter } from "./routers/todo-list-router";
import { cors } from "hono/cors";

/**
 * This is your base API.
 * Here, you can handle errors, not-found responses, cors and more.
 *
 * @see https://jstack.app/docs/backend/app-router
 */
const api = j
  .router()
  .basePath("/api")
  //.use(j.defaults.cors)
  .use(
    cors({
      origin: "https://colab-todo.vercel.app",
      allowHeaders: ["x-is-superjson", "content-type"],
      exposeHeaders: ["x-is-superjson", "content-type"],
      credentials: true,
    }),
  )
  .onError(j.defaults.errorHandler);

/**
 * This is the main router for your server.
 * All routers in /server/routers should be added here manually.
 */
const appRouter = j.mergeRouters(api, {
  post: postRouter,
  todoList: todoListRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
