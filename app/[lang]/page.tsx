export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const src = lang === "nl" ? "/zglobal_v7_two_brands_nl.html" : "/zglobal_v7_two_brands.html";
  return (
    <iframe
      src={src}
      title="ZGlobal"
      style={{
        border: "none",
        width: "100%",
        height: "100vh",
      }}
    />
  );
}
