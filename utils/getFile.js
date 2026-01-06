export default function (collection, filename, format = "json") {
  const inner = async (collection, filename, format) => {
    console.log("collection, filename:", collection, filename);
    let out = await queryCollection(collection)
      .path("/" + filename)
      .first();
    if (format === "text") {
      return out.rawbody
        ?.trim()
        .replaceAll("\\n", "\n")
        .replaceAll("\\t", "\t")
        .replaceAll("\\r", "\r");
    }
    return out;
  };
  if (format.startsWith("asyncdata")) {
    return useAsyncData(
      `${collection}-${filename}-${format}`,
      () => inner(collection, filename, format.split("|")?.[1] || "json"),
      { server: true, lazy: false },
    );
  } else {
    return inner(collection, filename, format);
  }
}
