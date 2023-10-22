import { Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { findBucketFile, setBucketFile } from "../services/buckets.ts";

export async function handleGetBucket(ctx: Context) {
  const bucket = ctx.params.bucket;

  if (!bucket) {
    ctx.response.status = 400;
    ctx.response.body = "Required bucket param is missing.";
    return;
  }

  const key = ctx.params.key;

  if (!key) {
    ctx.response.status = 400;
    ctx.response.body = "Required key param is missing.";
    return;
  }

  const res = await findBucketFile(bucket, key);

  if (!res || res.value == null) {
    ctx.response.status = 404;
    ctx.response.body = "No file with that key.";
    return;
  }

  const file = await Deno.readFile(res.value.src);

  ctx.response.status = 200;
  ctx.response.body = file;
  ctx.response.headers.set("Content-Type", res.value.contentType);
  ctx.response.headers.set(
    "Content-Disposition",
    `attachment; filename="${res.value.originalName}"`
  );
  ctx.response.headers.set('Content-Length', file.byteLength.toString() /* stat.size.toString() */);
}

export async function handleSetBucket(ctx: Context) {
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

  if (!ctx.request.hasBody) {
    ctx.response.status = 415;
    ctx.response.body = "Required body is missing.";
    return;
  }

  if (!ctx.request.headers.get('content-type')?.includes('multipart/form-data')) {
        ctx.response.status = 400;
        ctx.response.body = "Content type must be multipart/form-data.";
        return;
  }

  const bucket = ctx.params.bucket;

  if (!bucket) {
    ctx.response.status = 400;
    ctx.response.body = "Required bucket param is missing.";
    return;
  }

  const key = ctx.params.key;

  if (!key) {
    ctx.response.status = 400;
    ctx.response.body = "Required key param is missing.";
    return;
  }

  const formDataReader = ctx.request.body({ type: "form-data" }).value;
  const formDataBody = await formDataReader.read({ maxSize: 10000000 }); // Max file size to handle
  const files = formDataBody.files;

  if (!files) {
    ctx.response.status = 400;
    ctx.response.body = "Required attached file is missing.";
    return;
  }

  const [file] = files;

  if (!file || !file.content) {
    ctx.response.status = 400;
    ctx.response.body = "Required attached file is missing.";
    return;
  }

  const res = await setBucketFile(bucket, key, file)

  if (!res) {
    ctx.response.status = 500;
    ctx.response.body = "Error setting bucket file.";
    return;
  }

  ctx.response.status = 201;
  ctx.response.body = {
    message: "Bucket file set.",
    url: `${Deno.env.get("HOST")}/buckets/${bucket}/${key}`,
  };
  ctx.response.headers.set("Content-Type", "application/json");
}
