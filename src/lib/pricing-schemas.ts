import { z } from "zod";
import { FEATURE_KEYS, PRICING, PROJECT_TYPES, type FeatureKey, type ProjectType } from "@/lib/pricing";

/** Zod-Schemas des Preisrechners – identisch im Client (RHF) und auf dem Server. */

export const quoteSelectionSchema = z.object({
  projectType: z.enum(PROJECT_TYPES as [ProjectType, ...ProjectType[]]),
  design: z.enum(["custom", "template"]),
  features: z.array(z.enum(FEATURE_KEYS as [FeatureKey, ...FeatureKey[]])),
  extraLanguages: z.number().int().min(0).max(PRICING.extraLanguage.max),
  maintenance: z.boolean(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Bitte gib deinen Namen an."),
  email: z.email("Bitte gib eine gültige E-Mail-Adresse an."),
  phone: z.string().max(40).optional(),
  company: z.string().max(120).optional(),
  message: z.string().max(1000).optional(),
});

/** Vollständige Eingabe, die an die Server Action gesendet wird. */
export const quoteLeadSchema = quoteSelectionSchema.extend(contactSchema.shape);

export type QuoteLeadInput = z.infer<typeof quoteLeadSchema>;

