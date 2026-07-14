import { ProjectForm } from "../project-form";
import { createProject } from "../actions";

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-ink">Nouveau projet</h1>
      <div className="mt-8">
        <ProjectForm action={createProject} />
      </div>
    </div>
  );
}
