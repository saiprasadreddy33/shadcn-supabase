import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "",
          label: "Menu",
          active: pathname.includes("/posts"),
          icon: SquarePen,
          submenus: [

            {
              href: "/dashboard",
              label: "Data",
              active: pathname === "/posts/new"
            }
          ]
        },
        {
          href: "/categories",
          label: "Inventory",
          active: pathname.includes("/categories"),
          icon: Bookmark,
          submenus: []
        },
        {
          href: "/tags",
          label: "Tags",
          active: pathname.includes("/tags"),
          icon: Tag,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/users",
          label: "User",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: []
        },
      ]
    }
  ];
}
