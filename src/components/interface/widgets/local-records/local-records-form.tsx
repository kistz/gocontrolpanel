"use client";

import FormElement from "@/components/form/form-element";
import FourSideInput from "@/components/form/manialink/four-side-input";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { FONTS } from "@/lib/manialink/attributes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  LocalRecordsSchema,
  LocalRecordsSchemaType,
} from "./local-records-schema";

export default function LocalRecordsForm({
  defaultValues,
  onChange,
}: {
  defaultValues?: LocalRecordsSchemaType;
  onChange?: (data: LocalRecordsSchemaType) => void;
}) {
  const form = useForm<LocalRecordsSchemaType>({
    resolver: zodResolver(LocalRecordsSchema),
    defaultValues,
  });

  form.watch((data) => {
    if (onChange) {
      onChange(data);
    }
  });

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-bold">Header</span>

          <FormElement
            name={"header.text"}
            label="Text"
            placeholder="Records"
          />

          <FormElement
            name={"header.font"}
            type="select"
            options={FONTS.map((font) => ({
              value: font,
              label: font,
            }))}
            label="Font"
            placeholder="RobotoCondensedBold"
          />
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <span className="font-bold">Record</span>

          <FourSideInput
            control={form.control}
            name={"record.padding"}
            label="Padding"
            errors={form.formState.errors.record?.padding}
            min={0}
          />

          <span className="font-bold">Border</span>

          <FormElement
            name={"record.border.color"}
            label="Color"
            placeholder="8888"
          />

          <FourSideInput
            control={form.control}
            name={"record.border"}
            label="Border"
            errors={form.formState.errors.record?.border}
            min={0}
          />

          <span className="font-bold">Position</span>

          <FormElement
            name={"record.position.width"}
            label="Width"
            type="number"
            placeholder="4"
          />

          <FormElement
            name={"record.position.font"}
            label="Font"
            type="select"
            options={FONTS.map((font) => ({
              value: font,
              label: font,
            }))}
            placeholder="RobotoCondensedBold"
          />

          <FormElement
            name={"record.position.color"}
            label="Color"
            placeholder="FFF"
          />
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <span className="font-bold">Player</span>

          <FormElement
            name={"record.player.font"}
            label="Font"
            type="select"
            options={FONTS.map((font) => ({
              value: font,
              label: font,
            }))}
            placeholder="RobotoCondensed"
          />

          <FormElement
            name={"record.player.color"}
            label="Color"
            placeholder="FFF"
          />

          <FourSideInput
            control={form.control}
            name={"record.player.padding"}
            label="Padding"
            errors={form.formState.errors.record?.player?.padding}
            min={0}
          />
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <span className="font-bold">Time</span>

          <FormElement
            name={"record.time.font"}
            label="Font"
            type="select"
            options={FONTS.map((font) => ({
              value: font,
              label: font,
            }))}
            placeholder="RobotoCondensedBold"
          />

          <FormElement
            name={"record.time.color"}
            label="Color"
            placeholder="0C6"
          />

          <FourSideInput
            control={form.control}
            name={"record.time.padding"}
            label="Padding"
            errors={form.formState.errors.record?.time?.padding}
            min={0}
          />
        </div>
      </form>
    </Form>
  );
}
