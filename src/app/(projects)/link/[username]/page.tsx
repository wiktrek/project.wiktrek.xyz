
export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username;
  if (!username ) {
    return <div>Wrong route</div>;
  }
  return (
    <>
        <p>{username}</p>
    </>
  );
}