"use client";
import { Puck, type Config } from "@measured/puck";


type Components = {
  HeadingBlock: {
    children: string;
  };
};

// Create Puck component config
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

// Render Puck editor
export function Editor() {
  return (
    <Puck
      config={config}
      data={{}}
    />
  );
}
