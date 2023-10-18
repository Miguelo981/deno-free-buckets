import { Context, Middleware } from "https://deno.land/x/oak@v12.6.0/mod.ts";

export const xApiKeyMiddleware: Middleware = (ctx: Context, next) => {
  const apiKey = ctx.request.headers.get("x-api-key");

  if (!apiKey) {
    ctx.response.status = 401;
    ctx.response.body = "Unauthorized.";
    return;
  }

  if (apiKey !== Deno.env.get("X_API_KEY")) {
    ctx.response.status = 403;
    ctx.response.body = "Forbidden.";
    return;
  }
  
  next();
};
