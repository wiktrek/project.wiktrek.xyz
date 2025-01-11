import Link from "next/link";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center text-center">
      <p className="text-xl">
        Browser games I made because I wanted to have something to do in school
      </p>
      <ul className="">
        <li className="text-xl font-medium">
          <Link href="/games/clicker" className="text-primary hover:underline">
            clicker
          </Link>
          : simple clicker game
        </li>
        <li className="text-xl font-medium">
          <Link href="/games/aim" className="text-primary hover:underline">
            aim
          </Link>
          : click buttons
        </li>
      </ul>
    </main>
  );
}
