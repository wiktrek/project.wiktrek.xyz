import { router } from "./trpc";
import { questionRouter } from "./routers/questions";
import { recipeRouter } from "./routers/recipe";
import { shortRouter } from "./routers/short";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  question: questionRouter,
  recipe: recipeRouter,
  short: shortRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
