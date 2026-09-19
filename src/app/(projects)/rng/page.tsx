"use client";
import { useState } from "react";
const Rng = () => {
  const [min,setMin] = useState(0);
  const [max,setMax] = useState(10);
  const [amount,setAmount] = useState(1);
  const [output,setOutput] = useState([] as number[])
  function random(min: number,max:number): number{
    return Math.floor(Math.random() * (max - min) + min)
  }
  const [error, setError] = useState("");
  function generateRandom(count: number) {
    if (![min, max, count].every(Number.isInteger)) {
      return setError("Use whole numbers only.");
    }
    if (min >= max) return setError("Minimum must be less than maximum.");
    if (count < 1 || count > 100) {
      return setError("Amount must be between 1 and 100.");
    }
    setError("");
    const values: number[] = [];
    for (let i = 0; i < count; i++) values.push(random(min, max));
    setOutput(values);
  }
  return (
    <main className="flex flex-col w-screen justify-center items-center">
      <div className="flex flex-col w-80">
        <label className="text-xl">min</label>
          <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} />
        <label className="text-xl">max</label>
          <input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} />  
        <label className="text-xl">amount</label>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} ></input>
        <button onClick={() => generateRandom(amount)}>Generate</button>
        {error && <p className="text-red-400" role="alert">{error}</p>}
        <div>{output.map((o,i) => <p key={`${i}.${o}`}>{o}</p>)}</div>
      </div>
    </main>
  )
}
export default Rng;
