"use client";
import Draggable from "react-draggable";
export default function Page() {
  return (
    <div className="mx-auto flex">
      <Main />
    </div>
  );
}
function Main() {
  return (
    <div className="mx-auto h-96 w-96 bg-slate-700">
      <Apps />
      <BlogApp />
    </div>
  );
}
function runApp(id: string) {
  let app = document.getElementById(id);
  if (app) {
    app.classList.toggle("hidden");
  }
}
function Apps() {
  return (
    <>
      <div>
        <button
          className="flex text-3xl font-extrabold"
          onClick={() => runApp("blog")}
        >
          Blog
        </button>
      </div>
    </>
  );
}
function BlogApp() {
  return (
    <div id="blog" className="hidden">
      <Draggable>
        <div className="absolute h-64 w-40 cursor-move rounded-xl bg-white p-4 font-bold text-black">
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
        </div>
      </Draggable>
    </div>
  );
}
