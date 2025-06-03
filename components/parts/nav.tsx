import AccountWidget from "../auth/widget";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/parts/mode-toggle";
import { getUsageForUser } from "@/lib/data/users";
import { LucideProps } from "lucide-react";

import Logo from "@/public/expologosecond.png";

import {
  BarChart,
  GraduationCapIcon,
  TargetIcon,
  CheckCircle2Icon,
  BookCheck,
  HeartIcon,
  Layers,
  LifeBuoy,
  Disc3,
  Book,
  ActivityIcon,
  MessageCircleIcon,
} from "lucide-react";

// Navigation links
const links = [
  { href: "/", text: "Dashboard", icon: BarChart },
  { href: "/coaches", text: "College Programs", icon: GraduationCapIcon },
  { href: "/campaigns", text: "My Campaigns", icon: Layers, locked: true },
  { href: "/leads", text: "Favorites", icon: HeartIcon, locked: true },
  { href: "/activity", text: "Activity & Tasks", icon: CheckCircle2Icon },
  { href: "/toolkit", text: "Recruiting Toolkit", icon: BookCheck },
  { href: "/chat", text: "Coach Al", icon: MessageCircleIcon },
];

const otherLinks = [
  { href: "https://exporecruits.com", text: "Expo Recruits", icon: Book },
  { href: "/support", text: "Support", icon: LifeBuoy },
];

export default async function Nav() {
  const usage = await getUsageForUser();
  const plan = usage?.data?.plan;

  return (
    <nav className="p-4 flex flex-col gap-4 justify-between h-screen">
      {/* Logo */}
      <Link
        href="/"
        className="border bg-muted/50 flex items-center gap-2 rounded-lg p-6"
      >
        <Image
          className="-mt-px mb-px"
          src={Logo}
          width={100}
          height={100}
          alt="Expo Recruits Logo"
        />
      </Link>

      {/* Navigation links */}
      <div className="border bg-muted/50 rounded-lg flex flex-col justify-between p-6 h-full">
        <div className="flex flex-col gap-8">
          <div className="grid gap-2">
            {links.map((link) => (
              <NavLink
                key={link.href}
                icon={link.icon}
                href={link.href}
                locked={link.locked}
              >
                {link.text}
              </NavLink>
            ))}
            {otherLinks.map((link) => (
              <NavLink
                key={link.href}
                icon={link.icon}
                href={link.href}
              >
                {link.text}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Footer section */}
        <div className="flex flex-col gap-8">
          <AccountWidget plan={plan} />
          <div className="flex justify-between items-center gap-2">
            <ModeToggle />
            <p className="text-xs text-muted-foreground opacity-50">
              &copy; Expo Recruits, 2025
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}

// NavLink component
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon: React.ComponentType<LucideProps>;
  className?: string;
  locked?: boolean;
}

const NavLink = ({
  href,
  children,
  icon: Icon,
  className,
  locked = false,
}: NavLinkProps) => {
  if (locked) {
    return (
      <div
        className={`flex items-center gap-2 p-2 rounded-md -ml-2 text-muted-foreground cursor-not-allowed opacity-60 ${className}`}
        title="Coming Soon"
      >
        <Icon size={20} />
        <span>{children}</span>
        
      </div>
    );
  }

  return (
    <Link
      className={`flex items-center gap-2 group p-2 rounded-md -ml-2 transition-all hover:bg-muted ${className}`}
      href={href}
    >
      <Icon
        className="text-muted-foreground group-hover:text-foreground transition-all"
        size={20}
      />
      {children}
    </Link>
  );
};
