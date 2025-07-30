"use client";

import AddGroupModal from "@/components/modals/add-group";
import Modal from "@/components/modals/modal";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

export const createActions = (refetch: () => void) => {
  return (
    <Modal>
      <AddGroupModal onSubmit={refetch} />
      <Button className="w-9 sm:w-auto">
        <IconPlus />
        <span className="hidden sm:inline">Add Group</span>
      </Button>
    </Modal>
  );
};
