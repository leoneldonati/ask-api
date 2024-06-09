import sharp from "sharp";

async function optimizeAvatar(
  file: Buffer,
  { folder }: { folder: string }
): Promise<{ ok: boolean; filePath?: string; error?: any }> {
  const filePath = `./temp-files/optimized-${folder}-${crypto.randomUUID()}.avif`;
  try {
    if (folder === "avatar") {
      await sharp(file)
        .resize({
          width: 55,
          height: 55,
          fit: "cover",
          position: "center",
        })
        .toFormat("avif")
        .toFile(filePath);

      return {
        ok: true,
        filePath,
      };
    }
    await sharp(file)
      .resize({
        width: 55,
        height: 55,
        fit: "cover",
        position: "center",
      })
      .toFormat("avif")
      .toFile(filePath);
    return {
      ok: true,
      filePath,
    };
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
}

export { optimizeAvatar };
