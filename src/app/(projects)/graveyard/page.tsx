import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Graveyard - wiktrek",
  description: "Where my side projects rest in peace",
};

interface DeadProject {
  name: string;
  description: string;
  dateStart: Date;
  dateEnd: Date;
}

const deadProjects: DeadProject[] = [
  {
    name: "golink",
    description: "Too lazy to finish for now",
    dateStart: new Date("2025-08-03"),
    dateEnd: new Date("2025-08-07"),
  },
  {
    name: "goclick",
    description: "Too lazy to finish for now",
    dateStart: new Date("2025-08-03"),
    dateEnd: new Date("2025-08-03"),
  },
];

function lifespan(start: Date, end: Date) {
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();
  if (startYear !== endYear) return `${startYear} - ${endYear}`;
  const startMonth = start.toLocaleString("en-US", { month: "long" });
  const endMonth = end.toLocaleString("en-US", { month: "long" });
  if (startMonth === endMonth) return `${startMonth} ${startYear}`;
  return `${startMonth} - ${endMonth} ${startYear}`;
}

export default function Graveyard() {
  return (
    <main className="flex w-screen flex-col items-center">
      <h1 className="my-8 text-4xl">Project graveyard</h1>
      <div className="grid grid-cols-1 gap-8 px-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {deadProjects.map((project) => (
          <div
            key={project.name}
            className="flex w-64 flex-col items-center rounded-t-full border border-slate-600 bg-slate-700 px-6 pb-8 pt-12 text-center"
          >
            <p className="text-3xl">&#10013;</p>
            <p className="mt-2 text-xl font-bold">{project.name}</p>
            <p className="text-slate-300">
              {lifespan(project.dateStart, project.dateEnd)}
            </p>
            <p className="mt-4 italic text-slate-400">
              &quot;{project.description}&quot;
            </p>
            <p className="mt-4 text-sm text-slate-500">R.I.P.</p>
          </div>
        ))}
      </div>
    </main>
  );
}
