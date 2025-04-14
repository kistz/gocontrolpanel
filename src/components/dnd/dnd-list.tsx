"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SetStateAction } from "react";
import DndListRow from "./dnd-list-row";

export interface DndListColumn<TData> {
  id: string;
  cell?: ({ data }: { data: TData }) => React.ReactNode;
  visibility?: boolean;
}

interface DndListProps<TData extends { id: string | number }> {
  columns: DndListColumn<TData>[];
  data: TData[];
  setData: (value: SetStateAction<TData[]>) => void;
  limitHeight?: number;
}

export function DndList<TData extends { id: string | number }>({
  columns,
  data,
  setData,
  limitHeight = 206,
}: DndListProps<TData>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setData((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);

        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  return (
    <main className="grid gap-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={data} strategy={verticalListSortingStrategy}>
          <div
            className="flex flex-col flex-1 overflow-auto gap-2"
            style={{ maxHeight: `calc(100vh - ${limitHeight}px)` }}
          >
            {data.map((item) => (
              <DndListRow
                id={item.id}
                row={item}
                columns={columns.filter(
                  (column) => column.visibility !== false,
                )}
                key={item.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </main>
  );
}
