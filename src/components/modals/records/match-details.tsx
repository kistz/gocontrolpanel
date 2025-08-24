import { MatchesWithMapAndRecords } from "@/actions/database/matches";
import { DataTable } from "@/components/table/data-table";
import { IconX } from "@tabler/icons-react";
import { Card } from "../../ui/card";
import { DefaultModalProps } from "../default-props";
import { createColumns } from "./match-details-columns";

export default function MatchDetailsModal({
  closeModal,
  data,
}: DefaultModalProps<MatchesWithMapAndRecords>) {
  if (!data) return null;

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const columns = createColumns(data.records.some((record) => record.round));

  return (
    <Card
      onClick={stopPropagation}
      className="p-6 gap-6 sm:min-w-[400px] max-sm:w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Match Details</h1>
        <IconX
          className="h-6 w-6 cursor-pointer text-muted-foreground"
          onClick={closeModal}
        />
      </div>

      <div className="flex gap-4 flex-1 min-h-0 max-w-full">
        <DataTable
          columns={columns}
          data={data.records}
          pagination
          className="overflow-y-auto"
        />
      </div>
    </Card>
  );
}
