import z from "zod";

const ManiaControlSettings = z.object({
  type: z.literal("maniacontrol"),
  admins: z.array(z.string()).optional(),
});

const EvoSCSettings = z.object({
  type: z.literal("evosc"),
});

const MiniControlSettings = z.object({
  type: z.literal("minicontrol"),
  admins: z.array(z.string()).optional(),
  excludedPlugins: z.array(z.string()).optional(),
  contactInfo: z.string().min(1, {
    message: "Contact info is required",
  }),
  identifier: z.string(),
  secret: z.string(),
});

const PyPlanetSettings = z.object({
  type: z.literal("pyplanet"),
});

export const ServerControllerSchema = z.discriminatedUnion("type", [
  EvoSCSettings,
  ManiaControlSettings,
  MiniControlSettings,
  PyPlanetSettings,
]);