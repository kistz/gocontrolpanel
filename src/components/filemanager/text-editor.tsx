"use client";

import { saveFileText } from "@/actions/filemanager";
import { getErrorMessage } from "@/lib/utils";
import { xml } from "@codemirror/lang-xml";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function TextEditor({
  path,
  defaultText = "",
  serverId,
}: {
  path: string;
  defaultText: string;
  serverId: number;
}) {
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  const [text, setText] = useState<string>(defaultText);
  const isDark = resolvedTheme === "dark";

  const handleCancel = () => {
    const parentPath = path.split("/").slice(0, -1).join("/");
    router.push(`/server/${serverId}/files?path=${parentPath}`);
  };

  const handleSave = async () => {
    try {
      const { error } = await saveFileText(serverId, path, text);

      if (error) {
        throw new Error("Failed to save file");
      }

      toast.success("File saved successfully", {
        description: "Your changes have been saved.",
      });
    } catch (error) {
      console.error("Error saving file:", error);
      toast.error("Failed to save file", {
        description: getErrorMessage(error),
      });
    }
  };

  const styles = EditorView.baseTheme({
    // Default
    "&.cm-editor.cm-focused": {
      outline: "none",
    },

    // Dark mode
    "&dark .cm-cursor": {
      borderLeftColor: "white !important",
    },
    "&dark .cm-gutter": {
      backgroundColor: "black",
    },
    "&dark .cm-gutterElement": {
      backgroundColor: "black",
      color: "white",
      opacity: 0.5,
    },
    "&dark .cm-activeLine": {
      backgroundColor: "#111 !important",
    },
    "&dark .cm-selectionBackground": {
      backgroundColor: "#444 !important",
    },

    // Light mode
    "&light .cm-cursor": {
      borderLeftColor: "black !important",
    },
    "&light .cm-gutter": {
      backgroundColor: "white",
    },
    "&light .cm-gutterElement": {
      backgroundColor: "white",
      color: "black",
      opacity: 0.5,
    },
    "&light .cm-activeLine": {
      backgroundColor: "#eee !important",
    },
    "&light &.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#bbb !important",
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between w-full">
        <h1 className="text-xl font-bold">{path}</h1>
        <div className="flex gap-2">
          <Button variant={"outline"} onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>

      <CodeMirror
        suppressHydrationWarning
        value={text}
        height="100%"
        width="100%"
        onChange={(value) => setText(value)}
        extensions={[EditorView.lineWrapping, xml(), styles]}
        theme={isDark ? "dark" : "light"}
        className="border-1"
      />
    </div>
  );
}
