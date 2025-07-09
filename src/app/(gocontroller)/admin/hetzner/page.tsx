import { getAllHetznerProjects } from "@/actions/database/hetzner-projects";
import { getAllUsers } from "@/actions/database/users";
import AddProjectModal from "@/components/modals/add-project";
import Modal from "@/components/modals/modal";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { getList } from "@/lib/utils";
import { IconPlus } from "@tabler/icons-react";

export default async function AdminHetznerPage() {
  const session = await auth();

  const { data: users } = await getAllUsers();
  const { data: projects } = await getAllHetznerProjects();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 justify-between sm:items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Manage Hetzner Projects</h1>
          <h4 className="text-muted-foreground">
            Manage your Hetzner projects and cloud servers.
          </h4>
        </div>

        <Modal>
          <AddProjectModal data={{ users }} />
          <Button>
            <IconPlus /> Add Project
          </Button>
        </Modal>
      </div>

      {projects.map((project) => (
        <div key={project.id} className="p-4 bg-card rounded-lg shadow">
          <h2 className="text-xl font-semibold">{project.name}</h2>
          <p className="text-muted-foreground">
            Managed by:{" "}
            {project.users.map((user) => user.user.nickName).join(", ")}
          </p>
          <p className="text-sm text-muted-foreground">
            API Tokens:{" "}
            {getList(project.apiTokens).length > 0
              ? getList(project.apiTokens).join(", ")
              : "None"}
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(project.updatedAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
