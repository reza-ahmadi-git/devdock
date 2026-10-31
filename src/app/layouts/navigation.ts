import {
  BookOpen,
  HardDriveDownload,
  LayoutDashboard,
  ListTodo,
  PanelsTopLeft,
} from "lucide-react";

export const navigationItems = [
  { label: "Overview", path: "/", icon: LayoutDashboard },
  { label: "Projects", path: "/projects", icon: PanelsTopLeft },
  { label: "Tasks", path: "/tasks", icon: ListTodo },
  { label: "Learning", path: "/learning", icon: BookOpen },
  { label: "Backup", path: "/backup", icon: HardDriveDownload },
];

export function getPageTitle(pathname: string) {
  return (
    navigationItems.find((item) => item.path === pathname)?.label ?? "Overview"
  );
}
