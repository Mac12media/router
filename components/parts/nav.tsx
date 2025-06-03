// Component Imports
import AccountWidget from "../auth/widget";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/parts/mode-toggle";
import { getUsageForUser } from "@/lib/data/users";
import { LucideProps } from "lucide-react";

// Image Imports
import Logo from "@/public/expologo2.png";

// Icon Imports
import { BarChart, GraduationCapIcon,  TargetIcon,CheckCircle2Icon, BookCheck, HeartIcon, Layers, LifeBuoy, Disc3, Book, ActivityIcon, MessageCircleIcon } from "lucide-react";

const links = [
  { href: "/", text: "Dashboard", icon: BarChart },
      { href: "/coaches", text: "College Programs", icon: GraduationCapIcon },

  { href: "/campaigns", text: "My Campaigns", icon: Layers },
  { href: "/leads", text: "Favorites", icon: HeartIcon },

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
      <Link
        href="/"
        className="border bg-muted/50 flex items-center gap-2 rounded-lg p-6"
      >
        <Image
          className="-mt-px mb-px"
          src={Logo}
          width={100}
          height={100}
          alt="Router.so Wordmark"
        />
      </Link>
      <div className="border bg-muted/50 rounded-lg flex flex-col justify-between p-6 h-full">
        <div className="flex flex-col gap-8">
          <div className="grid gap-2">
            {links.map((link) => (
              <NavLink key={link.href} icon={link.icon} href={link.href}>
                {link.text}
              </NavLink>
            ))}
            {otherLinks.map((link) => (
              <NavLink key={link.href} icon={link.icon} href={link.href}>
                {link.text}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-8">
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
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon: React.ComponentType<LucideProps>;
  className?: string;
}

const NavLink = ({ href, children, icon: Icon, className }: NavLinkProps) => {
  return (
    <Link
      className={`flex items-center gap-2 group p-2 rounded-md -ml-2 transition-all ${className}`}
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
