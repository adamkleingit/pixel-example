import type { FastifyInstance } from "fastify";
import { DEFAULT_THEME, type ThemeSettings } from "@kanban/shared";
import { AppDataSource } from "../data-source";
import { SettingsEntity } from "../entities/Settings";

function serializeSettings(settings: SettingsEntity) {
  return {
    id: settings.id,
    theme: settings.theme,
    updatedAt: settings.updatedAt.toISOString(),
  };
}

async function getOrCreateSettings() {
  const repo = AppDataSource.getRepository(SettingsEntity);
  let settings = await repo.findOne({ where: {} });
  if (!settings) {
    settings = repo.create({ theme: DEFAULT_THEME });
    settings = await repo.save(settings);
  }
  return settings;
}

export async function settingsRoutes(app: FastifyInstance) {
  app.get("/api/settings", async () => {
    const settings = await getOrCreateSettings();
    return serializeSettings(settings);
  });

  app.put<{ Body: { theme: ThemeSettings } }>("/api/settings", async (request, reply) => {
    const theme = request.body?.theme;
    if (!theme || typeof theme !== "object") {
      return reply.code(400).send({ error: "theme is required" });
    }

    const required: (keyof ThemeSettings)[] = [
      "primaryColor",
      "accentColor",
      "backgroundColor",
      "surfaceColor",
      "textColor",
      "fontFamily",
      "borderRadius",
    ];

    for (const key of required) {
      if (theme[key] === undefined || theme[key] === null) {
        return reply.code(400).send({ error: `theme.${key} is required` });
      }
    }

    const repo = AppDataSource.getRepository(SettingsEntity);
    const settings = await getOrCreateSettings();
    settings.theme = {
      primaryColor: String(theme.primaryColor),
      accentColor: String(theme.accentColor),
      backgroundColor: String(theme.backgroundColor),
      surfaceColor: String(theme.surfaceColor),
      textColor: String(theme.textColor),
      fontFamily: String(theme.fontFamily),
      borderRadius: Number(theme.borderRadius) || 0,
    };

    const saved = await repo.save(settings);
    return serializeSettings(saved);
  });
}
