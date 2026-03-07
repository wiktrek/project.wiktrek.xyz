"use client";
import { CreateLinkProfileForm } from "~/app/_components/linkComponent";
export default function Page() {

  return (
    <div className="flex justify-center text-center, items-center flex-col">
      <h1>Create custom profile</h1>
      <CreateLinkProfileForm onSubmit={(e) => console.log(e)}/>
    </div>
    );
}