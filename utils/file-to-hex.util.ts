export const fileToHex = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  return [...new Uint8Array(arrayBuffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
};
