import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "../ui/card";
import { DndListColumn } from "./dnd-list";

interface DndListRowProps<TData> {
  id: string | number;
  row: TData;
  columns: DndListColumn<TData>[];
}

export default function DndListRow<TData>({
  id,
  row,
  columns,
}: DndListRowProps<TData>) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCursorGrabbing = attributes["aria-pressed"];
  console.log(columns);
  return (
    <Card
      ref={setNodeRef}
      style={style}
      key={id}
      className={cn(
        "flex flex-row items-center justify-between p-2 gap-1",
        ` ${isCursorGrabbing ? "cursor-grabbing" : "cursor-grab"}`,
      )}
      {...attributes}
      {...listeners}
      aria-describedby={`DndContext-${id}`}
    >
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-1 overflow-hidden overflow-ellipsis"
        >
          {column.cell ? (
            <column.cell data={row} />
          ) : (
            <span className="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm">
              {row[column.id as keyof TData] as string}
            </span>
          )}
        </div>
      ))}
    </Card>
  );
}
