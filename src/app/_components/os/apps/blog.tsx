import { AppComponent } from "./apps";
interface App {
  name: string;
  icon: string;
  id: string;
}
export function BlogApp() {
  return (
    <AppComponent id="blog">
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
