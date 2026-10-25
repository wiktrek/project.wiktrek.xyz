import { apps } from "./apps";

export function About() {
  const specs = [
    ["Version", "slopos 2.0"],
    ["Kernel", "React 19 + Next.js"],
    ["Apps", `${apps.length} installed`],
    ["Developer", "wiktrek"],
  ];

  return (
    <div className="flex h-full items-center gap-6 p-6">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md border border-white/15 text-4xl font-light text-white">
        w
      </div>
      <div className="min-w-0">
        <h1 className="text-2xl font-light">slopos</h1>
        <p className="text-text-400 mb-4 text-sm">
          An operating system that lives in your browser.
        </p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          {specs.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-text-500">{k}</dt>
              <dd className="text-text-200">{v}</dd>
            </div>
          ))}
        </dl>
        <a
          href="https://github.com/wiktrek"
          target="_blank"
          className="text-text-400 mt-4 inline-block text-sm underline-offset-4 hover:text-white hover:underline"
        >
          github.com/wiktrek
        </a>
      </div>
    </div>
  );
}
