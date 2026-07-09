import { api } from "~/trpc/server";
import type { Metadata } from "next";

function getDomainEnding(url: string) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    const parts = hostname.split(".");

    if (parts.length <= 2) return hostname;

    return parts.slice(-2).join(".");
  } catch {
    return url;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const username = (await params).username;
  const data = await api.link.getProfile({ slug: username });
  const name = data?.profile.displayName ?? data?.profile.username ?? username;

  return {
    title: `${name} - links`,
    description: data?.profile.bio ?? undefined,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username;
  if (!username) return <div>Wrong route</div>;

  const data = await api.link.getProfile({ slug: username });

  if (!data) {
    return (
      <main className="min-h-screen bg-white p-2 text-black [@media(prefers-color-scheme:dark)]:bg-black [@media(prefers-color-scheme:dark)]:text-white">
        <h1>Profile not found</h1>
      </main>
    );
  }

  const { profile, links } = data;
  const activeLinks = links.filter((l) => l.isActive);

  return (
    <main className="min-h-screen bg-white p-2 text-black [@media(prefers-color-scheme:dark)]:bg-black [@media(prefers-color-scheme:dark)]:text-white">
      <h1>
        {profile.displayName ? `${profile.displayName} - ` : ""}
        @{profile.username}
      </h1>
      {profile.bio && <p>{profile.bio}</p>}
      <br />
      <div>
        {activeLinks.length === 0 && <p>No links yet</p>}
        {activeLinks.map((l) => (
          <a
            key={l.id}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00e] visited:text-[#551a8b] [@media(prefers-color-scheme:dark)]:text-[#8ab4f8] [@media(prefers-color-scheme:dark)]:visited:text-[#c58af9]"
          >
            {l.title} ({getDomainEnding(l.url)})
          </a>
        ))}
      </div>
      <footer className="absolute bottom-2 text-xs">
        <div>
          <a
            href="https://wiktrek.xyz"
            className="text-[#00e] visited:text-[#551a8b] [@media(prefers-color-scheme:dark)]:text-[#8ab4f8] [@media(prefers-color-scheme:dark)]:visited:text-[#c58af9]"
          >
            I{"'"}m{" "}
          </a>
          not responsible for any link posted here if something breaks any kind
          of law please{" "}
          <a
            href="mailto:me@wiktrek.xyz"
            className="text-[#00e] visited:text-[#551a8b] [@media(prefers-color-scheme:dark)]:text-[#8ab4f8] [@media(prefers-color-scheme:dark)]:visited:text-[#c58af9]"
          >
            contact me
          </a>
          {" I will remove it if It breaks any rules"}
        </div>
      </footer>
    </main>
  );
}
