export interface EditForm {
  employeeId: string;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
}

export type EditFormKey = keyof Pick<EditForm, 'employeeId' | 'name' | 'email' | 'password'>;
