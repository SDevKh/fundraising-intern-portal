export interface Intern {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  totalDonations: number;
  joinDate: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  requirement: number;
  unlocked: boolean;
  icon: string;
}