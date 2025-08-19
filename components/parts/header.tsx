import { Crown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Header: React.FC<HeaderProps> = ({ title, children }) => {
  const showUpgrade =
    title === "Football Programs" || title === "Basketball Programs";

  return (
    <section className="flex font-light gap-2 text-lg pb-5 mb-6 border-b items-center justify-between p-3 sm:p-2">
      {/* Left side: Title and optional children */}
      <div className="flex items-center gap-2">
        <h1 className="font-normal">{title}</h1>
        {children && <h3 className="text-muted-foreground">: {children}</h3>}
      </div>

      {/* Right side: Minimalist Upgrade Button */}
      {showUpgrade && (
        <Link href="/upgrade">
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2 rounded-full px-6 py-2
                       bg-black text-white dark:bg-white dark:text-black
                       hover:opacity-90 transition-all"
          >
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="tracking-wide">
              Upgrade
            </span>
          </Button>
        </Link>
      )}
    </section>
  );
};
