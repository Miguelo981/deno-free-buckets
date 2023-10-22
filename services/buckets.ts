import { FormDataFile } from "https://deno.land/x/oak@v12.6.0/mod.ts";

const dbUrl = Deno.env.get('ENV') === 'production' ? Deno.env.get('KV_URL') : './db';

export async function findBucketFile(bucket: string, key: string): Promise<any> {
  const kv = await Deno.openKv(dbUrl);
  const res = await kv.get([bucket, key]);

  // TODO load metadata and parse base64 string to file

  kv.close();

  return res;
}

export async function setBucketFile(bucket: string, key: string, value: FormDataFile) {
  const kv = await Deno.openKv(dbUrl);

  // TODO check file, store metadata and base64 encode file

  const res = await kv.set([bucket, key], value);

  kv.close();

  return res;
}
