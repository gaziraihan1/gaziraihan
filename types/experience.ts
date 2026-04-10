export type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
  order: number;
  // ✅ Note: createdAt/updatedAt excluded because we don't select them
};