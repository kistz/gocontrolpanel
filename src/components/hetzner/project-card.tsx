"use client";
import {
  deleteHetznerProject,
  HetznerProjectsWithUsers,
} from "@/actions/database/hetzner-projects";
import { getErrorMessage, getList } from "@/lib/utils";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useRouter } from "next/navigation";

export default function ProjectCard({
  project,
}: {
  project: HetznerProjectsWithUsers;
}) {
  const router = useRouter();

  const handleDeleteProject = async () => {
    try {
      const { error } = await deleteHetznerProject(project.id);
      if (error) {
        throw new Error(error);
      }
      router.refresh();
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Error deleting project", {
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <Card className="p-4 gap-2">
      <div className="flex justify-between gap-2 items-center">
        <h3 className="text-lg font-semibold truncate min-w-o">
          {project.name}
        </h3>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              // Handle edit project logic here
              console.log(`Edit project: ${project.id}`);
            }}
          >
            <IconEdit />
            <span className="sr-only">Edit Project</span>
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onClick={handleDeleteProject}
          >
            <IconTrash />
            <span className="sr-only">Delete Project</span>
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        API Tokens: {getList(project.apiTokens).join(", ") || "None"}
      </p>
      <p className="text-sm text-muted-foreground">
        Users: {project.users.map((user) => user.user.nickName).join(", ")}
      </p>
    </Card>
  );
}
