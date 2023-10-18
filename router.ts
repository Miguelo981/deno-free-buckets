import { Router } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { handleGetBucket, handleSetBucket } from "./handlers/buckets.ts";
import { xApiKeyMiddleware } from "./middleware/x-api-key.ts";

export const router = new Router();

router.get("/buckets/:key", handleGetBucket);
router.post("/buckets/:key", xApiKeyMiddleware, handleSetBucket);