import sharp from "sharp";

async function optimizeAvatar(
  file: Buffer,
  { folder }: { folder: string }
): Promise<{ ok: boolean; filesPaths?: string[]; error?: any }> {
  const optimizedFilePath = `./temp-files/optimized/${folder}-${crypto.randomUUID()}.avif`;
  const originalFilePath = `./temp-files/original/${folder}-${crypto.randomUUID()}.avif`
  try {
      await sharp(file)
        .resize({
          width: 55,
          height: 55,
          fit: "cover",
          position: "center",
        })
        .toFormat("avif")
        .toFile(optimizedFilePath);

        await sharp(file)
          .resize({
            fit: 'cover',
            position: 'center'
          })
          .toFormat('avif')
          .toFile(originalFilePath)

      return {
        ok: true,
        filesPaths: [optimizedFilePath, originalFilePath],
      };

  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
}

async function optimizePostAsset(file: Buffer, { folder }: { folder: string }) {
  const filePath = `./temp-files/original/${folder}-${crypto.randomUUID()}`
  try {
    await sharp(file)
      .resize({
        fit: 'cover',
        position: 'center'
      })
      .toFormat('avif')
      .toFile(filePath)

      return {
        ok: true,
        filePath
      }
  }
  catch (err) {
    return {
      ok: false,
      error: err
    }
  }
}

export { optimizeAvatar, optimizePostAsset };
