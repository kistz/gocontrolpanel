"use client";

import AddProjectModal from "@/components/modals/add-project";
import Modal from "@/components/modals/modal";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

export const createActions = (refetch: () => void) => {
  return (
    <Modal>
      <AddProjectModal onSubmit={refetch} />
      <Button className="w-9 sm:w-auto">
        <IconPlus />
        <span className="hidden sm:inline">Add Project</span>
      </Button>
    </Modal>
  );
};
