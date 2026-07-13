import {
  Home,
  Compass,
  Wallet,
  CreditCard,
  PlusCircle,
  Layers,
  Landmark,
  History,
  Users,
  ShieldAlert,
  FolderCog,
} from "lucide-react";

export const dashboardNav = {
  supporter: [
    { label: "Home", href: "/dashboard/supporter-home", icon: Home },
    { label: "Explore Campaigns", href: "/dashboard/explore", icon: Compass },
    {
      label: "My Contributions",
      href: "/dashboard/my-contributions",
      icon: Wallet,
    },
    {
      label: "Purchase Credit",
      href: "/dashboard/purchase-credit",
      icon: CreditCard,
    },
    {
      label: "Payment History",
      href: "/dashboard/payment-history",
      icon: History,
    },
  ],
  creator: [
    { label: "Home", href: "/dashboard/creator-home", icon: Home },
    {
      label: "Add New Campaign",
      href: "/dashboard/add-campaign",
      icon: PlusCircle,
    },
    { label: "My Campaigns", href: "/dashboard/my-campaigns", icon: Layers },
    { label: "Withdrawals", href: "/dashboard/withdrawals", icon: Landmark },
    {
      label: "Payment History",
      href: "/dashboard/payment-history",
      icon: History,
    },
  ],
  admin: [
    { label: "Home", href: "/dashboard/admin-home", icon: Home },
    { label: "Manage Users", href: "/dashboard/manage-users", icon: Users },
    {
      label: "Manage Campaigns",
      href: "/dashboard/manage-campaigns",
      icon: FolderCog,
    },
    {
      label: "Withdrawal Requests",
      href: "/dashboard/withdrawal-requests",
      icon: Landmark,
    },
    { label: "Reports", href: "/dashboard/reports", icon: ShieldAlert },
  ],
};
