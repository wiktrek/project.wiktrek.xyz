import Link from "next/link";

export default function TryLoggingIn() {
  return (
    <h1 className="text-2xl">
      Loading... If it {"doesn't"} load try{" "}
      <Link href="/sign-in" className="font-bold text-ring underline">
        logging in again
      </Link>
    </h1>
  );
}
