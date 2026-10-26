// Makes the light JPEG copies the desk shows: blog covers (public/blog/*.png) and
// project screenshots (public/work/*.png) go to public/desk/{blog,work}/*.jpg.
// Run after adding a post or a project image: npm run desk:images
import { readdirSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, parse } from "node:path";
import sharp from "sharp";

const jobs = [
  { from: "public/blog", to: "public/desk/blog", width: 900 },
  { from: "public/work", to: "public/desk/work", width: 1000 },
];

for (const job of jobs) {
  mkdirSync(job.to, { recursive: true });
  for (const file of readdirSync(job.from)) {
    if (!/\.(png|jpe?g|webp)$/i.test(file)) continue;
    const out = join(job.to, parse(file).name + ".jpg");
    const src = join(job.from, file);
    if (existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs)
      continue;
    await sharp(src)
      .resize({ width: job.width, withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(out);
    console.log(out);
  }
}
