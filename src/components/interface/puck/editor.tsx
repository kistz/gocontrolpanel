"use client";
import { Button } from "@/components/ui/button";
import { createUsePuck, Data, Puck, type Config } from "@measured/puck";
import { IconDeviceDesktop, IconDeviceFloppy } from "@tabler/icons-react";

const usePuck = createUsePuck();

type Components = {
  HeadingBlock: {
    children: string;
  };
};

export const config: Config<Components> = {
  components: {
    HeadingBlock: {
      fields: {
        children: {
          type: "text",
        },
      },
      defaultProps: {
        children: "Hello, Puck!",
      },
      render: ({ children }) => {
        return <h1>{children}</h1>;
      },
    },
  },
};

const save = (data: Data) => {};

export function Editor() {
  return (
    <Puck
      config={config}
      data={{}}
      overrides={{
        headerActions: () => {
          const appState = usePuck((s) => s.appState);

          return (
            <Button
              onClick={() => {
                save(appState.data);
              }}
            >
              <IconDeviceFloppy />
              Save
            </Button>
          );
        },
      }}
      viewports={[
        {
          width: 1920 / 2,
          height: 1080 / 2,
          label: "Window",
          icon: <IconDeviceDesktop size={16} />,
        },
      ]}
    />
  );
}
