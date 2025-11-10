export interface ChatQuickActions {
  section: string;
  label: string;
  value: string;
}

export interface ChatProps {
  section: string;
  apiUrl: string;
  quickActions?: ChatQuickActions[];
}