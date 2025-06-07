export default function Test() {
  return (
    <div>
      <div className="bg-red-500 p-4 text-white">
        Red background (basic Tailwind)
      </div>
      <div className="bg-background text-foreground p-4">Custom background</div>
      <div className="bg-primary text-primary-foreground p-4">
        Primary color
      </div>
    </div>
  );
}
