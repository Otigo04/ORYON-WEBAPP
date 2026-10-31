import { z } from "zod";

/**
 * Server-Validierung des Konfigurator-Formulars. Bewusst in einer eigenen Datei,
 * damit zod nicht im Client-Bundle der Startseite (Preisrechner → `brief.ts`)
 * landet.
 */

const valueSchema = z.union([
  z.string().max(5000),
  z.array(z.string().max(300)).max(50),
]);

export const briefSubmitSchema = z.object({
  contact: z.object({
    name: z.string().min(2, "Bitte gib deinen Namen an.").max(120),
    email: z.string().email("Bitte gib eine gültige E-Mail-Adresse an.").max(200),
    phone: z.string().max(60).optional().default(""),
    company: z.string().max(160).optional().default(""),
  }),
  data: z.record(z.string(), valueSchema).default({}),
  summary: z
    .object({
      projectType: z.string().max(60).optional(),
      design: z.string().max(60).optional(),
      features: z.array(z.string().max(60)).max(30).optional(),
      extraLanguages: z.number().int().min(0).max(50).optional(),
      maintenance: z.boolean().optional(),
      hosting: z.boolean().optional(),
      priceMin: z.number().int().min(0).optional(),
      priceMax: z.number().int().min(0).optional(),
    })
    .default({}),
});

export type BriefSubmitInput = z.infer<typeof briefSubmitSchema>;

