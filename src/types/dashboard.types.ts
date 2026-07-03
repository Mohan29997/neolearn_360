export interface IDashboardData {
  totalUsers: number;
  activePrograms: number;
  benchCount: number;
  completionRate: number;
  learningJourneys: number;
  departments: IDepartmentPerf[];
  recentActivity: IActivityItem[];
  benchStatus: IBenchStatus;
}

export interface IDepartmentPerf {
  name: string;
  completion: number;
}

export interface IActivityItem {
  text: string;
  bold: string;
  time: string;
}

export interface IBenchStatus {
  onboarding: number;
  training: number;
  poc: number;
  deploymentReady: number;
}
