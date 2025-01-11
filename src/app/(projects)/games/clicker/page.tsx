"use client";
import { useEffect, useState } from "react";
interface Item {
  name: string;
  defaultPrice: number;
  quantity: number;
  clicks: number;
}
// return amount of money that items bought will give every few seconds
function storeMoney(items: Item[]): number {
  let sum = 0;
  items.map((item) => {
    sum += item.clicks * item.quantity;
  });
  return sum;
}

export default function Page() {
  const [store, setStore] = useState(readLocalStorage()[0] ?? getStore());
  const [money, setMoney] = useState(readLocalStorage()[1] ?? 0);
  const [cooldown, setCooldown] = useState(false);
  function readLocalStorage(): [Item[], number] {
    const items = JSON.parse(localStorage.getItem("items") as string) as Item[];
    const money = JSON.parse(localStorage.getItem("money") as string) as number;
    return [items, money];
  }
  function saveLocalStorage(items: Item[], money: number) {
    console.log("saved!");
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("money", money.toString());
  }
  useEffect(() => {
    const interval = setInterval(() => {
      const newMoney = storeMoney(store);
      console.log(newMoney);
      setMoney((prevMoney) => prevMoney + newMoney);
      saveLocalStorage(store, money);
    }, 2000);

    return () => clearInterval(interval);
  }, [store]);
  return (
    <main>
      <section className="items-center justify-center text-center">
        <p className="text-3xl font-bold">balance: {money}</p>
        <button
          className="m-4 rounded-lg bg-background-600 p-2 text-2xl font-bold disabled:bg-background-800"
          disabled={cooldown}
          onClick={() => {
            if (!cooldown) {
              setCooldown(true);
              setMoney(money + 1);
              window.setTimeout(() => setCooldown(false), 500);
            }
          }}
        >
          Click!
        </button>
      </section>
      <aside className="flex justify-between">
        <div className="text-xl">
          <p>
            You will get: <b className="text-secondary">{storeMoney(store)}</b>{" "}
            every 2 seconds!
          </p>
          {store.map((item, i) => {
            return (
              <li>
                <p>
                  {item.name}: {item.quantity * item.clicks}
                </p>
              </li>
            );
          })}
        </div>
        <ul>
          {store.map((item, i) => {
            return (
              <li>
                <button
                  className="mt-2 flex w-36 justify-between rounded bg-background-600 p-2 text-xl font-semibold disabled:bg-background-800"
                  disabled={money < getPrice(item)}
                  onClick={() => {
                    setMoney(money - getPrice(item));
                    item.quantity++;
                  }}
                >
                  {item.name}
                  <p>{getPrice(item)}</p>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
      <footer className="fixed bottom-0 flex w-full justify-center text-center text-xs">
        Yes I know you can change every value in local storage
      </footer>
    </main>
  );
}
function getStore(): Item[] {
  const defaultStore: Item[] = [
    { name: "cursor", defaultPrice: 10, quantity: 0, clicks: 1 },
    { name: "cook", defaultPrice: 500, quantity: 0, clicks: 5 },
    { name: "engineer", defaultPrice: 2500, quantity: 0, clicks: 10 },
  ];
  return defaultStore;
}
function getPrice(item: Item): number {
  return Math.floor(item.defaultPrice * Math.pow(1.1, item.quantity));
}
