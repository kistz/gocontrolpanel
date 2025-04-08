import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ServerSettings } from "@/types/server";
import { UseFormReturn } from "react-hook-form";

interface SettingsFormProps {
  form: UseFormReturn<ServerSettings>;
  onSubmit: (values: ServerSettings) => void;
}

export default function SettingsForm({ form, onSubmit }: SettingsFormProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="gap-4 lg:gap-x-8 2xl:gap-x-16 grid grid-rows-18 lg:grid-rows-9 
        2xl:grid-rows-6 grid-flow-col"
      >
        <FormElement
          control={form.control}
          name={"defaultOptions.serverName"}
          label="Server Name"
          description="The name of the server."
          placeholder="Server name..."
          error={form.formState.errors.defaultOptions?.serverName}
          className="w-full min-w-64"
          isRequired
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.serverComment"}
          label="Server Comment"
          description="The comment of the server."
          placeholder="Server comment..."
          error={form.formState.errors.defaultOptions?.serverComment}
          className="w-full min-w-64"
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.serverPassword"}
          label="Server Password"
          description="The password of the server for players."
          placeholder="Server password..."
          error={form.formState.errors.defaultOptions?.serverPassword}
          className="w-2/3 min-w-64"
          type="password"
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.serverPasswordSpectator"}
          label="Server Password Spectator"
          description="The password of the server for spectators."
          placeholder="Server password spectator..."
          error={form.formState.errors.defaultOptions?.serverPasswordSpectator}
          className="w-2/3 min-w-64"
          type="password"
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.callVoteTimeout"}
          label="Call Vote Timeout"
          description="The timeout for call vote in seconds."
          placeholder="Call vote timeout..."
          error={form.formState.errors.defaultOptions?.callVoteTimeout}
          className="w-20"
          type="number"
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.callVoteRatio"}
          label="Call Vote Ratio"
          description="The ratio for call vote."
          placeholder="Call vote ratio..."
          error={form.formState.errors.defaultOptions?.callVoteRatio}
          className="w-20"
          type="number"
          step="0.05"
        />
        <FormElement
          control={form.control}
          name={"defaultOptions.serverVisibility"}
          label="Server Visibility"
          description="The visibility of the server."
          options={[
            { label: "Visible", value: "visible" },
            { label: "Hidden", value: "hidden" },
            { label: "Hidden from nations", value: "hidden from nations" },
          ]}
          error={form.formState.errors.defaultOptions?.serverVisibility}
          className="w-3/5 min-w-48"
          type="select"
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.maxPlayers"}
          label="Max Players"
          description="The maximum number of players."
          placeholder="Max players..."
          error={form.formState.errors.defaultOptions?.maxPlayers}
          className="w-20"
          type="number"
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.maxSpectators"}
          label="Max Spectators"
          description="The maximum number of spectators."
          placeholder="Max spectators..."
          error={form.formState.errors.defaultOptions?.maxSpectators}
          className="w-20"
          type="number"
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.keepPlayerSlots"}
          label="Keep Player Slots"
          description="Keep player slots for spectators."
          error={form.formState.errors.defaultOptions?.keepPlayerSlots}
          className="w-20"
          type="checkbox"
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.allowMapDownload"}
          label="Allow Map Download"
          description="Allow map download."
          error={form.formState.errors.defaultOptions?.allowMapDownload}
          className="w-20"
          type="checkbox"
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.autoSaveReplays"}
          label="Auto Save Replays"
          description="Auto save replays."
          error={form.formState.errors.defaultOptions?.autoSaveReplays}
          className="w-20"
          type="checkbox"
        />
        <FormElement
          control={form.control}
          name={"defaultOptions.horns"}
          label="Horns"
          description="Enable horns."
          error={form.formState.errors.defaultOptions?.horns}
          className="w-20"
          type="checkbox"
        />

        <FormElement
          control={form.control}
          name={"defaultOptions.serviceAnnouncements"}
          label="Service Announcements"
          description="Enable service announcements."
          error={form.formState.errors.defaultOptions?.serviceAnnouncements}
          className="w-20"
          type="checkbox"
        />

        <FormElement
          control={form.control}
          name={"downloadRate"}
          label="Download Rate"
          description="The download rate of the server."
          placeholder="Download rate..."
          error={form.formState.errors.downloadRate}
          className="w-26"
          type="number"
        />

        <FormElement
          control={form.control}
          name={"uploadRate"}
          label="Upload Rate"
          description="The upload rate of the server."
          placeholder="Upload rate..."
          error={form.formState.errors.uploadRate}
          className="w-26"
          type="number"
        />

        <FormElement
          control={form.control}
          name={"profileSkins"}
          label="Profile Skins"
          description="Enable profile skins."
          error={form.formState.errors.profileSkins}
          className="w-20"
          type="checkbox"
        />

        <Button type="submit" className="mt-4 w-1/4 min-w-24" disabled={form.formState.isSubmitting}>
          Save
        </Button>
      </form>
    </Form>
  );
}
