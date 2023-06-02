export function hexToBlob(str: string): Blob {
  const match = str.match(/.{2}/g);
  if (match) {
    const byteArray = new Uint8Array(match.map((e) => parseInt(e, 16)));
    return new Blob([byteArray], { type: "application/octet-stream" });
  } else return new Blob();
}
