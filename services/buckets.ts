import { resolve, join } from "https://deno.land/std@0.193.0/path/mod.ts";
import { FormDataFile } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";

const baseDir = "./assets/";
const dbUrl = Deno.env.get('ENV') === 'production' ? Deno.env.get('KV_URL') : './db';

console.log(dbUrl)

export async function findBucketFile(bucket: string, key: string): Promise<any> {
  const kv = await Deno.openKv(dbUrl);
  
  try {
    const res = await kv.get([bucket, key]);

    return res;
  } catch (err) {
    console.error(err);
  } finally {
    kv.close();
  }
}

export async function setBucketFile(bucket: string, key: string, value: FormDataFile) {
  const kv = await Deno.openKv(dbUrl);

  const bucketPath = join(baseDir, bucket)

  if (!existsSync(bucketPath)) {
    Deno.mkdirSync(bucketPath);
  }

  const newFileName = resolve(join(bucketPath, value.originalName));
  await Deno.writeFile(`${newFileName}`, value.content!);

  const metadata = {
    name: value.name,
    type: value.contentType,
    filename: value.filename,
    originalName: value.originalName,
    src: newFileName,
    createdAt: new Date().toISOString(),
  }

  try {
    const res = await kv.set([bucket, key], metadata);

    return res;
  } catch (err) {
    console.error(err);
  } finally {
    kv.close();
  }
}
