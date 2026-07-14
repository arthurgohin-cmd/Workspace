import * as z from "zod";

export const ContactSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court."),
  email: z.email("Email invalide."),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(10, "Message trop court."),
});

export const ProjectFormSchema = z.object({
  title: z.string().trim().min(2, "Titre requis."),
  slug: z.string().trim().optional(),
  city: z.enum(["PARIS", "CANNES", "MIAMI"]),
  location: z.string().trim().min(2, "Localisation requise."),
  status: z.enum(["IN_PROGRESS", "COMPLETED"]),
  propertyType: z.string().trim().min(2, "Typologie requise."),
  surfaceM2: z.string().trim().optional(),
  budgetLabel: z.string().trim().optional(),
  summary: z.string().trim().min(5, "Résumé requis."),
  description: z.string().trim().optional(),
  startDate: z.string().trim().optional(),
  endDate: z.string().trim().optional(),
  featured: z.string().optional(),
  order: z.string().trim().optional(),
});

export const TeamMemberFormSchema = z.object({
  name: z.string().trim().min(2, "Nom requis."),
  role: z.string().trim().min(2, "Rôle requis."),
  bio: z.string().trim().optional(),
  order: z.string().trim().optional(),
});

export const InvestorSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court."),
  email: z.email("Email invalide."),
  phone: z.string().trim().optional(),
  ticketRange: z.string().trim().optional(),
  projectInterest: z.string().trim().optional(),
  message: z.string().trim().min(10, "Message trop court."),
});
