const dbPath = './db';

export async function findBucketFile(key: string): Promise<any> {
  const kv = await Deno.openKv(dbPath);
  const res = await kv.get([key]);

  kv.close();

  return res;
}

export async function setBucketFile(key: string, value: BufferSource) {
  const kv = await Deno.openKv(dbPath);
  const res = await kv.set([key], value);

  kv.close();

  return res;
}
