function checkwin(
  one: string,
  two: string,
  three: string,
  four: string,
  five: string,
  six: string,
  seven: string,
  eight: string,
  nine: string
) {
  let win = "";
  if (one === "❌" && two === "❌" && three === "❌") return (win = "❌ won");
  if (four === "❌" && five === "❌" && six === "❌") return (win = "❌ won");
  if (seven === "❌" && eight === "❌" && nine === "❌")
    return (win = "❌ won");
  if (one === "❌" && five === "❌" && nine === "❌") return (win = "❌ won");
  if (three === "❌" && five === "❌" && seven === "❌")
    return (win = "❌ won");
  if (one === "❌" && four === "❌" && seven === "❌") return (win = "❌ won");
  if (two === "❌" && five === "❌" && eight === "❌") return (win = "❌ won");
  if (three === "❌" && six === "❌" && nine === "❌") return (win = "❌ won");
  if (one === "⭕" && two === "⭕" && three === "⭕") return (win = "⭕ won");
  if (four === "⭕" && five === "⭕" && six === "⭕") return (win = "⭕ won");
  if (seven === "⭕" && eight === "⭕" && nine === "⭕")
    return (win = "⭕ won");
  if (one === "⭕" && five === "⭕" && nine === "⭕") return (win = "⭕ won");
  if (three === "⭕" && five === "⭕" && seven === "⭕")
    return (win = "⭕ won");
  if (one === "⭕" && four === "⭕" && seven === "⭕") return (win = "⭕ won");
  if (two === "⭕" && five === "⭕" && eight === "⭕") return (win = "⭕ won");
  if (three === "⭕" && six === "⭕" && nine === "⭕") return (win = "⭕ won");

  if (
    one !== "" &&
    two !== "" &&
    three !== "" &&
    four !== "" &&
    five !== "" &&
    six !== "" &&
    seven !== "" &&
    eight !== "" &&
    nine !== ""
  )
    return (win = "🏳 Its a draw");
  return win;
}
export default checkwin;
