import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LockIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/button";

const favoritePrograms = [
  {
    name: "Alabama",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Alabama_Crimson_Tide_logo.svg/2048px-Alabama_Crimson_Tide_logo.svg.png",
    link: "https://alabama.com/",
  },
  {
    name: "Michigan",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Michigan_Wolverines_logo.svg/1200px-Michigan_Wolverines_logo.svg.png",
    link: "https://texassports.com/",
  },
  {
    name: "Alabama",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Alabama_Crimson_Tide_logo.svg/2048px-Alabama_Crimson_Tide_logo.svg.png",
    link: "https://alabama.com/",
  },
  {
    name: "Michigan",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Michigan_Wolverines_logo.svg/1200px-Michigan_Wolverines_logo.svg.png",
    link: "https://texassports.com/",
  },
  {
    name: "Alabama",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Alabama_Crimson_Tide_logo.svg/2048px-Alabama_Crimson_Tide_logo.svg.png",
    link: "https://alabama.com/",
  },
];

export const FavPrograms = () => {
  return (
    <div className="relative">
      {/* Theme-aware Overlay */}
      <div className="absolute inset-0 z-10 backdrop-blur-sm bg-background/80 dark:bg-black/60 flex flex-col items-center justify-center text-center rounded-md pointer-events-none">
        <LockIcon className="w-8 h-8 mb-2 text-muted-foreground" />
        <p className="text-sm font-semibold text-muted-foreground">Coming Soon</p>
      </div>

      {/* Content with blur and disabled interactions */}
      <div className="blur-sm pointer-events-none space-y-6 select-none">
        <Card className="w-full flex flex-col">
          <CardHeader>
            <CardTitle>Target Programs</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 gap-4">
              {favoritePrograms.map((program) => (
                <div
                  key={program.name}
                  className="border justify-center rounded-sm p-3 flex items-center space-x-4 bg-muted/30"
                >
                  <div className="overflow-hidden">
                    <img
                      src={program.logo}
                      alt={program.name}
                      width={60}
                      height={60}
                      className="object-cover justify-center"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm">
              <div className="flex items-center gap-1">
                Edit List <ArrowRightIcon className="w-5 h-5" />
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
