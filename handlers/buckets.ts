import { Context } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { findBucketFile } from "../services/buckets.ts";
import { Base64 } from "https://deno.land/x/bb64@1.1.0/mod.ts";

export async function handleGetBucket(ctx: Context) {
  const key = ctx.params.key;

  if (!key) {
    ctx.response.status = 400;
    ctx.response.body = "Required key param is missing.";
    return;
  }

  const res = await findBucketFile(key);

  if (!res || res.value == null) {
    ctx.response.status = 404;
    ctx.response.body = "No file with that key.";
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = res.value;
  ctx.response.headers.set("Content-Type", "application/stream");
  ctx.response.headers.set(
    "Content-Disposition",
    `attachment; filename="${key}"`
  );
  //ctx.response.headers.set('Content-Length', file.byteLength.toString() /* stat.size.toString() */);
}

export async function handleSetBucket(ctx: Context) {
  if (!ctx.request.hasBody) {
    //ctx.throw(415);
    ctx.response.status = 415;
    ctx.response.body = "Required body is missing.";
    return;
  }

  /* if (!ctx.request.headers.get('content-type')?.includes('multipart/form-data')) {
        ctx.response.status = 400;
        ctx.response.body = "Content type must be multipart/form-data.";
        return;
    } */

  const key = ctx.params.key;

  if (!key) {
    ctx.response.status = 400;
    ctx.response.body = "Required key param is missing.";
    return;
  }

  const body = await ctx.request.body({
    contentTypes: {
      formData: ["multipart/form-data"],
    },
  });
  console.log(body);
  const data = await body.value;
  const readForm = await data.read();
  console.log("readForm", readForm);
  const parsedReqBody = Base64.fromUint8Array(data.fields.value!).toString();
  console.log(parsedReqBody);

  if (!parsedReqBody) {
    ctx.response.status = 400;
    ctx.response.body = "Required value param is missing.";
    return;
  }

  ctx.response.status = 201;
  ctx.response.body = {
    message: "Bucket file set.",
    url: `${Deno.env.get("HOST")}/buckets/${key}`,
  };
  ctx.response.headers.set("Content-Type", "application/json");
}
