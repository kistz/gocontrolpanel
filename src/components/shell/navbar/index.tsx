import { Icon } from "@tabler/icons-react";
import NavMain from "./nav-main";
import NavServers from "./nav-servers";

export interface NavItem {
  id?: number;
  name: string;
  url?: string;
  icon: Icon;
  items?: NavItem[];
  isActive?: boolean;
}

export interface NavGroup {
  name?: string;
  items: NavItem[];
}

export default function Navbar() {
  return (
    <>
      <NavMain />
      <NavServers />
    </>
  );
}
