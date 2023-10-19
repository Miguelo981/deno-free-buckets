const dbUrl = Deno.env.get('ENV') === 'production' ? Deno.env.get('KV_URL') : './db';

export async function findBucketFile(bucket: string, key: string): Promise<any> {
  const kv = await Deno.openKv(dbUrl);
  const res = await kv.get([bucket, key]);

  kv.close();

  return res;
}

export async function setBucketFile(bucket: string, key: string, value: BufferSource) {
  const kv = await Deno.openKv(dbUrl);
  const res = await kv.set([bucket, key], value);

  kv.close();

  return res;
}
