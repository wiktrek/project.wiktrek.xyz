import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className=" justify-center text-center items-center">
      <SignIn />
    </div>
  );
}
