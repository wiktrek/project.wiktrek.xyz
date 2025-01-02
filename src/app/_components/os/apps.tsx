import Draggable from "react-draggable";
import { closeApp, runApp } from "../lib/os";
interface App {
  name: string;
  icon: string;
  id: string;
}
const apps: App[] = [
  {
    name: "Blog",
    icon: "Blog Posts",
    id: "blog",
  },
  {
    name: "snake",
    icon: "Snake",
    id: "snake",
  },
];

export function Apps() {
  return (
    <>
      <ul>
        {apps.map((app) => (
          <li key={app.id} className="flex cursor-pointer items-center p-4">
            <div
              className="flex flex-col items-center justify-center"
              onClick={() => closeApp(app.id)}
            >
              <p className="text-wrap rounded bg-background-950 p-4 text-xl font-extrabold">
                {app.icon}
              </p>
              <p className="ml-4text-xl">{app.name}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
export function BlogApp() {
  return (
    <AppComponent id="blog">
      <button
        className="absolute right-2 top-2 text-3xl text-red-500"
        onClick={() => runApp("blog")}
      >
        X
      </button>
      <p className="text-xl">My blog posts</p>
      <ul>
        <li>
          <a
            href="https://wiktrek.xyz/blog/typing"
            target="_blank"
            className="text-accent"
          >
            Typing
          </a>
        </li>
        <li>
          <a
            href="https://wiktrek.xyz/blog"
            target="_blank"
            className="text-accent"
          >
            Read all my blog posts
          </a>
        </li>
      </ul>
    </AppComponent>
  );
}
export function AppComponent({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div id={id} className="hidden">
      <Draggable>
        <div className="absolute h-64 w-96 cursor-move rounded-xl bg-background-800 p-4 font-bold text-white">
          {children}
          <button
            className="absolute right-2 top-2 text-3xl text-red-500"
            onClick={() => runApp("blog")}
          >
            X
          </button>
        </div>
      </Draggable>
    </div>
  );
}
export function Snake() {
  return (
    <AppComponent id="snake">
      <div></div>
    </AppComponent>
  );
}
