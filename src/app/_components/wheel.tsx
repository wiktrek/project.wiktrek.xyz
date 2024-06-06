import React from "react";
interface props {
  texts: string[];
}
const Wheel = (props: props) => {
  return (
    <>
      <div className="text-white">
        {props.texts.map(text => {
            return (
                <a>{text}</a>
            )
})}
      </div>
    </>
  );
};

export default Wheel;

