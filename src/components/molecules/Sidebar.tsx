// components/molecules/Sidebar.tsx
import { 
  HomeIcon, 
  LayoutDashboardIcon, 
  SettingsIcon,
  UsersIcon,
  FileTextIcon,
  BarChart3Icon,
  MessageSquareIcon,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { JSX } from "react";

interface MenuItem {
  label: string;
  icon: LucideIcon;
  active: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps): JSX.Element {
  const menuItems: MenuItem[] = [
    { label: "Home", icon: HomeIcon, active: true },
    { label: "Dashboard", icon: LayoutDashboardIcon, active: false },
    { label: "Analytics", icon: BarChart3Icon, active: false },
    { label: "Customers", icon: UsersIcon, active: false },
    { label: "Reports", icon: FileTextIcon, active: false },
    { label: "Messages", icon: MessageSquareIcon, active: false },
    { label: "Settings", icon: SettingsIcon, active: false },
  ];

  return (
    <aside 
      className={cn(
        "lg:w-64 w-72 border-r bg-background flex flex-col fixed inset-y-0 z-30 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <span className="font-bold text-xl">AppName</span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
            <UsersIcon className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <div className="font-medium">User Name</div>
            <div className="text-sm text-muted-foreground">user@example.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}