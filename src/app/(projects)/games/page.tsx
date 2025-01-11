import Link from "next/link";

export default function Page() {
  return (
    <main className="items-center justify-center text-center">
      <p className="text-xl">
        Browser games I made because I wanted to have something to do in school
      </p>
      <ul className="">
        <li>
          <Link
            href="/games/clicker"
            className="text-xl font-medium text-primary hover:underline"
          >
            clicker
          </Link>
        </li>
      </ul>
    </main>
  );
}
