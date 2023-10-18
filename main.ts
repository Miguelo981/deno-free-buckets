import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
config({ export: true });

import { Application } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { router } from "./router.ts";

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: Number(Deno.env.get("PORT")) });