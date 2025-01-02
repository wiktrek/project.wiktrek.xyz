export function runApp(id: string) {
  let app = document.getElementById(id);
  if (app && !app.classList.contains("hidden")) {
    app.classList.toggle("hidden");
  }
}
export function closeApp(id: string) {
  let app = document.getElementById(id);
  if (app && app.classList.contains("hidden")) {
    app.classList.remove("hidden");
  }
}
