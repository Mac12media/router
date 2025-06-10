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
import { ArrowRightIcon } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Profile Card */}
      <Link href="/profile" className="block transition-shadow">
        <Card className="w-full flex flex-col cursor-pointer hover:shadow-md">
          <CardHeader className="">
            <CardTitle>Target Programs</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 flex-grow">
            

            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 gap-4">
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
        <Button
  variant="outline"
  size="sm"

> <Link href={`/coaches`} className="flex" passHref>
    Edit List 
    <ArrowRightIcon className="w-5 h-5 self-center"/>
  </Link>
</Button> 
          </CardContent>

          
        </Card>
      </Link>

    </div>
  );
};