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
  gradClass,
  position,
  height,
  weight,
  imageUrl,
}: {
  name: string;
  gradClass: string;
  position: string;
  height: string;
  weight: string;
  imageUrl: string;
}) => {
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Link href="/profile" className="block transition-shadow">
        <Card className="w-full flex flex-col cursor-pointer hover:shadow-md">
          <CardHeader className="mb-6 border-b">
            <CardTitle>Player Profile</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 flex-grow">
            <div className="grid gap-3 p-3 border rounded-sm bg-muted/25">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-base">{name}</p>
                  <p className="text-sm text-muted-foreground">
                    Class of {gradClass}
                  </p>
                  <p className="text-sm text-muted-foreground">{position}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t mt-2 text-center text-sm">
                <div>
                  <p className="font-semibold">{height}</p>
                  <p className="text-muted-foreground">Height</p>
                </div>
                <div>
                  <p className="font-semibold">{weight}</p>
                  <p className="text-muted-foreground">Weight</p>
                </div>
              </div>
            </div>
                      <CardTitle>Favorite Programs</CardTitle>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          {favoritePrograms.map((program) => (
            <Link
              key={program.name}
              href={program.link}
              target="_blank"
              rel="noopener noreferrer"
              className="border justify-center rounded-sm p-3 flex items-center space-x-4 hover:bg-muted/50 transition"
            >
              <div className=" overflow-hidden">
                <img
                  src={program.logo}
                  alt={program.name}
                  width={60}
                  height={60}
                  className="object-cover justify-center"
                />
              </div>
            </Link>
          ))}
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
