export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Administrator',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
};

export const WELCOME_SUBTITLES: Record<string, string> = {
  SUPER_ADMIN: 'The enterprise learning engine is currently operating at peak efficiency.',
  ADMIN: 'Manage your team, courses, and learning journeys from here.',
  MANAGER: "Track your team's learning progress and bench assignments.",
};

export const STAT_CARD_LABELS = {
  users: (isManager: boolean) => (isManager ? 'TEAM MEMBERS' : 'TOTAL ENROLLED USERS'),
  programs: 'ACTIVE PROGRAMS',
  bench: 'BENCH EMPLOYEES',
  completion: 'COMPLETION RATE',
  journeys: 'LEARNING JOURNEYS',
} as const;
