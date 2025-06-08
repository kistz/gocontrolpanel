"use client";

import { setShowOpponents } from "@/actions/gbx/game";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ShowOpponentsSchema, ShowOpponentsSchemaType } from "./game-schema";

export default function ShowOpponentsForm({
  serverUuid,
  showOpponents,
}: {
  serverUuid: string;
  showOpponents: number;
}) {
  const showOpponentsForm = useForm<ShowOpponentsSchemaType>({
    resolver: zodResolver(ShowOpponentsSchema),
    defaultValues: {
      showOpponents,
    },
  });

  async function onSubmitShowOpponents(values: ShowOpponentsSchemaType) {
    try {
      const { error } = await setShowOpponents(
        serverUuid,
        values.showOpponents,
      );
      if (error) {
        throw new Error(error);
      }
      toast.success("Show Opponents successfully updated");
    } catch (error) {
      toast.error("Failed to update Show Opponents", {
        description: getErrorMessage(error),
      });
    }
  }

  return (
    <Form {...showOpponentsForm}>
      <form
        onSubmit={showOpponentsForm.handleSubmit(onSubmitShowOpponents)}
        className="flex flex-col gap-2"
      >
        <FormElement
          control={showOpponentsForm.control}
          name={"showOpponents"}
          label="Show Opponents"
          description="The number of opponents to show. 0 is no override, 1 is show all, rest is the number of opponents."
          placeholder="Show Opponents..."
          error={showOpponentsForm.formState.errors.showOpponents}
          className="w-20"
          isRequired
          type="number"
        >
          <div className="flex gap-2">
            <Button
              variant={"outline"}
              className="w-20"
              type="button"
              onClick={() => showOpponentsForm.setValue("showOpponents", 0)}
            >
              Reset
            </Button>
            <Button
              variant={"outline"}
              className="w-20"
              type="button"
              onClick={() => showOpponentsForm.setValue("showOpponents", 1)}
            >
              Show All
            </Button>
            <Button
              className="w-20 hidden max-[500px]:hidden max-[960px]:block min-[1140px]:block"
              type="submit"
              disabled={showOpponentsForm.formState.isSubmitting}
            >
              Save
            </Button>
          </div>
        </FormElement>
        <div className="flex flex-col gap-1 max-[500px]:flex max-[960px]:hidden min-[1140px]:hidden">
          <Button
            className="w-20"
            type="submit"
            disabled={showOpponentsForm.formState.isSubmitting}
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
