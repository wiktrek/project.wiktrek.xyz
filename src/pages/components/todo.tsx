import Link from "next/link";
import React from "react";
interface props {
  name: string;
}
const Todo = (props: props) => {
  return (
    <>
      <div className="flex h-4 list-none items-center justify-between p-7 text-xl">
        <a>{props.name}</a>
        <a>I will finish this in the future</a>
      </div>
    </>
  );
};

export default Todo;
