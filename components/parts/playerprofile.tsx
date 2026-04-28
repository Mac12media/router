import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { LockIcon } from "lucide-react";

// Example favorite programs (these will stay but will be displayed as part of EXPO Score)
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
];



export const PlayerProfile = ({
  name,
  id,
  gradClass,
  position,
  sport,
  height,
  weight,
  imageUrl,
  ACD_score,
  ATH_score,
  plan,
}: {
  name: string;
  id: string;
  gradClass: string;
  position: string;
  sport: string;
  height: string;
  weight: string;
  imageUrl: string;
  ACD_score: string;
  ATH_score: string;
  plan?: string | null;
}) => {
  const showExpoMember = plan && plan !== "free";
  const normalizedSport = (sport ?? "").trim().toLowerCase();
  const isFlagFootball =
    normalizedSport === "girls_flag_football" || normalizedSport.includes("flag");
  const isFootball = normalizedSport === "football";
  const cardGradient = isFlagFootball
    ? "linear-gradient(145deg, rgba(244,114,182,0.98) 0%, rgba(236,72,153,0.92) 46%, rgba(190,24,93,0.84) 100%)"
    : isFootball
      ? "linear-gradient(145deg, rgba(255,153,92,0.98) 0%, rgba(255,114,0,0.92) 46%, rgba(194,65,12,0.84) 100%)"
      : "linear-gradient(145deg, rgba(255,153,92,0.98) 0%, rgba(255,114,0,0.92) 46%, rgba(194,65,12,0.84) 100%)";
  const scoreTextClass = isFlagFootball
    ? "text-pink-500"
    : isFootball
      ? "text-[#FF7200]"
      : "text-[#FF7200]";
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Link href={`/profile/${id}`} className="block transition-shadow">
        <Card className="w-full flex flex-col cursor-pointer hover:shadow-md">
          <CardHeader className="mb-6 border-b">
            <CardTitle>Recruiting Dashboard</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 flex-grow">
            <div
              className="grid gap-3 rounded-2xl border p-3 shadow-lg"
              style={{ background: cardGradient }}
            >
              <div className="flex items-center space-x-4">
                  <img
                    src={imageUrl}
                    alt={name}
                    width={64}
                    height={64}
                        className="w-16 h-16 rounded-full object-cover border border-white"

                  />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white text-base">{name}</p>
                    
                  </div>
                  <div className="flex gap-2 flex-row">

                  <p className="text-sm text-white text-muted-foreground">
                    {gradClass}
                  </p>
                  <p className="text-sm text-white  text-muted-foreground">{position}</p>
</div>
                </div>
                
              </div>
              

              <div className="grid grid-cols-2 gap-4  text-center text-sm">
                <div>
                  <p className="font-semibold text-white ">{height}</p>
                  <p className="text-muted-foreground text-white ">Height</p>
                </div>
                <div>
                  <p className="font-semibold text-white ">{weight}</p>
                  <p className="text-muted-foreground text-white ">Weight</p>
                </div>
              </div>
              {showExpoMember && (
               <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
          <img src="/sport-icons/verified.png" alt="" className="h-5 w-5" />
          Expo Member
        </span>
              )}
            </div>

            {/* EXPO Score Section */}
          <h3 className="text-sm font-semibold">EXPO+ Scores</h3>

          

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4">

              <Link
                  href={''}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border justify-center rounded-sm p-1 flex flex-col items-center hover:bg-muted/50 transition"
                >
                <span className="text-sm text-muted-foreground">Academic</span>
 
                <span className={`font-semibold text-lg ${scoreTextClass}`}>{ACD_score}</span>

                </Link>
                <Link
                  href={''}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border justify-center rounded-sm p-1 flex flex-col items-center hover:bg-muted/50 transition"
                >
                                  <span className="text-sm text-center text-muted-foreground">Athletic</span>

                                    <span className={`font-semibold text-lg ${scoreTextClass}`}>{ATH_score}</span>

                </Link>

            </div>
          </CardContent>

          <CardFooter className="mt-auto text-xs text-muted-foreground justify-center">
            Last updated recently
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
};
