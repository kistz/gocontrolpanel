"use client";

import { appendPlaylist, insertPlaylist } from "@/actions/gbx/game";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getErrorMessage } from "@/lib/utils";
import { Playlist } from "@/types/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PlaylistSchema } from "./game-schema";

export default function PlaylistForm() {
  const playlistForm = useForm<Playlist>({
    resolver: zodResolver(PlaylistSchema),
    defaultValues: {
      filename: "",
    },
  });

  async function onAppendPlaylist() {
    try {
      playlistForm.trigger("filename");
      const filename = playlistForm.getValues("filename");
      await appendPlaylist(filename);
      toast.success("Playlist appended successfully");
    } catch (error) {
      toast.error("Failed to append playlist", {
        description: getErrorMessage(error),
      });
    }
  }

  async function onInsertPlaylist() {
    try {
      playlistForm.trigger("filename");
      const filename = playlistForm.getValues("filename");
      await insertPlaylist(filename);
      toast.success("Playlist inserted successfully");
    } catch (error) {
      toast.error("Failed to insert playlist", {
        description: getErrorMessage(error),
      });
    }
  }

  return (
    <Form {...playlistForm}>
      <form className="flex flex-col gap-2">
        <FormElement
          control={playlistForm.control}
          name={"filename"}
          label="Playlist"
          description="The name of the file to append/insert playlist."
          placeholder="playlist.txt"
          error={playlistForm.formState.errors.filename}
          className="w-1/2 xl:w-2/3 xl:max-w-[calc(100%-192px)] min-w-48"
          isRequired
        >
          <div className="gap-2 hidden max-[500px]:hidden max-[960px]:flex min-[1080px]:flex">
            <Button className="w-20" type="button" onClick={onAppendPlaylist}>
              Append
            </Button>
            <Button className="w-20" type="button" onClick={onInsertPlaylist}>
              Insert
            </Button>
          </div>
        </FormElement>

        <div className="flex gap-2 max-[500px]:flex max-[960px]:hidden min-[1080px]:hidden">
          <Button className="w-20" type="button" onClick={onAppendPlaylist}>
            Append
          </Button>
          <Button className="w-20" type="button" onClick={onInsertPlaylist}>
            Insert
          </Button>
        </div>
      </form>
    </Form>
  );
}
