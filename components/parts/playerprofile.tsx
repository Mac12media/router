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

// Example scores for academic and athletic performance
const academicScore = 0; // Example academic score
const athleticScore = 0; // Example athletic score

export const PlayerProfile = ({
  name,
  id,
  gradClass,
  position,
  height,
  weight,
  imageUrl,
}: {
  name: string;
  id: string;
  gradClass: string;
  position: string;
  height: string;
  weight: string;
  imageUrl: string;
}) => {
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Link href={`/profile/${id}`} className="block transition-shadow">
        <Card className="w-full flex flex-col cursor-pointer hover:shadow-md">
          <CardHeader className="mb-6 border-b">
            <CardTitle>Player Profile</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 flex-grow">
            <div className="grid gap-3 p-3 shadow-lg border rounded-2xl bg-[#FF7200]">
              <div className="flex items-center space-x-4">
                  <img
                    src={imageUrl}
                    alt={name}
                    width={64}
                    height={64}
                        className="w-16 h-16 rounded-full object-cover border border-white"

                  />
                <div>
                  <p className="font-semibold text-white text-base">{name}</p>
                                  <div className="flex gap-2 flex-row">

                  <p className="text-sm text-white text-muted-foreground">
                    {gradClass}
                  </p>
                  <p className="text-sm text-white  text-muted-foreground">{position}</p>
</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white mt-2 text-center text-sm">
                <div>
                  <p className="font-semibold text-white ">{height}</p>
                  <p className="text-muted-foreground text-white ">Height</p>
                </div>
                <div>
                  <p className="font-semibold text-white ">{weight}</p>
                  <p className="text-muted-foreground text-white ">Weight</p>
                </div>
              </div>
            </div>

            {/* EXPO Score Section */}
          <h3 className="text-sm font-semibold">EXPO Score</h3>

          

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4">

              <Link
                  href={''}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border justify-center rounded-sm p-1 flex flex-col items-center hover:bg-muted/50 transition"
                >
                <span className="text-sm text-muted-foreground">Academic</span>
 
                <span className="font-semibold text-lg text-[#FF7200]">{academicScore}</span>

                </Link>
                <Link
                  href={''}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border justify-center rounded-sm p-1 flex flex-col items-center hover:bg-muted/50 transition"
                >
                                  <span className="text-sm text-center text-muted-foreground">Athletic</span>

                                    <span className="font-semibold text-lg text-[#FF7200]">{athleticScore}</span>

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
