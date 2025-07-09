import { getAllHetznerProjects } from "@/actions/database/hetzner-projects";
import { getAllUsers } from "@/actions/database/users";
import ProjectCard from "@/components/hetzner/project-card";
import AddProjectModal from "@/components/modals/add-project";
import Modal from "@/components/modals/modal";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard project={project} users={users} />
        ))}
      </div>
    </div>
  );
}
