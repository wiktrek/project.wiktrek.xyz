import React from "react";
interface props {
  name: string;
}
const Todo = (props: props) => {
  return (
    <>
      <div className="flex h-4 list-none items-center justify-between p-7 text-xl">
        <p>{props.name}</p>
      </div>
    </>
  );
};

export default Todo;
