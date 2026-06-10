import { notFound } from "next/navigation";
import { getPublicUserById } from "@/lib/data/users";
import PlayerCardClient from "./playercard-client";

const DEFAULT_ID = "f169ff24-a542-4e6a-b351-731f685d9482";

type PageProps = {
  searchParams?: Promise<{ id?: string }>;
};

function getCardText(user: {
  name: string | null;
  last_name: string | null;
  grad_year: string | null;
  position: string | null;
  sport: string | null;
  bio: string | null;
  high_school: string | null;
  city: string | null;
  state: string | null;
  height: string | null;
  weight: string | null;
  ACD_score: string | null;
  ATH_score: string | null;
  image: string | null;
  x_username: string | null;
  ig_username: string | null;
  email: string | null;
}) {
  return {
    fullName: [user.name, user.last_name].filter(Boolean).join(" ").trim(),
    role: user.position?.trim() || "ATHLETE",
    subtitle: user.sport?.trim() || "EXPO RECRUITS",
    bio:
      user.bio?.trim() ||
      `Athlete profile for ${[user.name, user.last_name].filter(Boolean).join(" ").trim() || "the player"}.`,
    refId:
      user.high_school?.trim() ||
      [user.city, user.state].filter(Boolean).join(", ").trim() ||
      "EXPO RECRUITS",
    dept: user.grad_year?.trim() || "2027",
    height: user.height?.trim() || "--",
    weight: user.weight?.trim() || "--",
    acdScore: user.ACD_score?.trim() || "--",
    athScore: user.ATH_score?.trim() || "--",
    image: user.image && !user.image.includes("blob") ? user.image : "/userplaceholder.png",
    instagram: user.ig_username?.trim() || "",
    x: user.x_username?.trim() || "",
    email: user.email?.trim() || "",
  };
}

export default async function PlayerCardPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const id = params.id ?? DEFAULT_ID;
  const user = await getPublicUserById({ id });

  if (!user) {
    notFound();
  }

  const card = getCardText(user);

  return <PlayerCardClient card={card} />;
}
