import AccountWidget from "../auth/widget";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { ModeToggle } from "@/components/parts/mode-toggle";
import { getUsageForUser } from "@/lib/data/users";
import { LogInIcon, LucideProps, RocketIcon } from "lucide-react";

import { useTheme } from "next-themes";

import FootballIcon from "@/public/football.png";
import BasketballIcon from "@/public/basketball.png";

import LogoDark from "@/public/expologo1logo.png";
import LogoLight from "@/public/expologo2logo.png";

import {
  BarChart,
  GraduationCapIcon,
  TargetIcon,
  CheckCircle2Icon,
  BookCheck,
  HeartIcon,
  Layers,
  LifeBuoy,
  User,
  Disc3,
  Book,
  ActivityIcon,
  MessageCircleIcon,
} from "lucide-react";
import Logo from "./logo";

const DEFAULT_ID = "f169ff24-a542-4e6a-b351-731f685d9482";

// Navigation links
const links1 = [
  { href: "/", text: "Dashboard", icon: BarChart },

  { href: "/football-programs", text: "College Programs", icon: GraduationCapIcon},
 // { href: "/leads", text: "Favorites", icon: HeartIcon, locked: true },
  //{ href: "/toolkit", text: "Recruiting Toolkit", icon: BookCheck },
 // { href: "/chat", text: "Coach Al", icon: MessageCircleIcon },
];

const links2 = [
 

 // { href: "/campaigns", text: "My Campaigns", icon: Layers, locked: true },
 // { href: "/leads", text: "Favorites", icon: HeartIcon, locked: true },
  { href: "/campaigns", text: "Campaigns", icon: RocketIcon },
  //{ href: "/toolkit", text: "Recruiting Toolkit", icon: BookCheck },
 // { href: "/chat", text: "Coach Al", icon: MessageCircleIcon },
];

const guestLinks = [
      { href: "/login", text: "Login", icon: LogInIcon },


];
const otherLinks = [
  { href: "https://exporecruits.com", text: "Support", icon: LifeBuoy },

];

export default async function Nav() {
  const usage = await getUsageForUser();
  const plan = usage?.data?.plan;
  const id = usage?.data?.id

 const hasValidId = Boolean(id);

  const navigationLinks1 = hasValidId ? links1 : guestLinks;
  const navigationLinks2 = hasValidId ? links2 : guestLinks;

  return (
    <nav className="p-4 flex flex-col gap-4 justify-between h-screen">
      {/* Logo */}
      <Link
        href="/"
        className="border bg-muted/50 flex items-center gap-2 rounded-lg p-6"
      >
          <Logo />
      </Link>

      <div className="border bg-muted/50 rounded-lg flex flex-col justify-between p-6 h-full">
        <div className="flex flex-col gap-8">
          <div className="grid gap-2">
            {navigationLinks1.map((link) => (
              <NavLink key={link.href} className="max-inline-size" icon={link.icon} href={link.href}>
                {link.text}
              </NavLink>
            ))}
          
{/* Insert SportLinks here in the same order */}

  {navigationLinks2.map((link) => (
              <NavLink key={link.href} className="max-inline-size" icon={link.icon} href={link.href}>
                {link.text}
              </NavLink>
            ))}

            {/* Only show profile if ID is available */}
            {hasValidId && (
              <NavLink icon={User} href={`/profile/${id}`}>
                Profile
              </NavLink>
            )}

            {/* Always show support link */}
            {otherLinks.map((link) => (
              <NavLink key={link.href} icon={link.icon} href={link.href}>
                {link.text}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Footer */}
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

interface SportLinkProps {
  href: string;
  children: React.ReactNode;
  image: StaticImageData; // from next/image imports
  className?: string;
  locked?: boolean;
}

const SportLink = ({
  href,
  children,
  image,
  className,
  locked = false,
}: SportLinkProps) => {
  if (locked) {
    return (
      <div
        className={`flex items-center gap-2 p-2 max-inline-size rounded-md -ml-2 text-muted-foreground cursor-not-allowed opacity-60 ${className}`}
        title="Coming Soon"
      >
        <Image src={image} alt="" width={20} height={20} />
        <span>{children}</span>
      </div>
    );
  }

  return (
    <Link
      className={`flex items-center gap-2 group p-2 max-inline-size rounded-md -ml-2 transition-all hover:bg-muted ${className}`}
      href={href}
      style={{ inlineSize: "max-content" }}
    >
      <Image
  src={image}
  alt={`${children} icon`}
  width={20}
  height={20}
  className="opacity-70 max-w-[20px] group-hover:opacity-100 transition-all"
  style={{ inlineSize: "max-content" }} // ensures inline sizing is respected
/>
{children}
    </Link>
  );
};

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
