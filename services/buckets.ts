const dbUrl = Deno.env.get('ENV') === 'production' ? Deno.env.get('KV_URL') : './db';

export async function findBucketFile(key: string): Promise<any> {
  const kv = await Deno.openKv(dbUrl);
  const res = await kv.get([key]);

  kv.close();

  return res;
}

export async function setBucketFile(key: string, value: BufferSource) {
  const kv = await Deno.openKv(dbUrl);
  const res = await kv.set([key], value);

  kv.close();

  return res;
}
