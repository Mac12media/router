import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Header } from "@/components/parts/header";
import EmailForm from "@/components/email/email-form"; // Updated to email form component
import { Home } from "lucide-react";
import { PageWrapper } from "@/components/parts/page-wrapper";
import Image from "next/image";
import Icon from "@/public/icon.svg";

const pageData = {
  name: "New Campaign",
  title: "Compose a New Campapign",
  description: "Fill in the details below to send a new campaign.",
};

export default async function Page() {
  return (
    <>
      <Breadcrumb className="h-[67.63px] bg-muted/50 rounded-lg border flex items-center justify-between p-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home size={20} />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/emails">Campaigns</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="px-2 py-1 bg-accent rounded-sm">
              {pageData?.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
        <Image
          className="hover:animate-spin dark:invert"
          src={Icon}
          width={24}
          height={24}
          alt="Router.so Icon"
        />
      </Breadcrumb>
      <PageWrapper>
        <Header title={pageData?.title}>{pageData?.description}</Header>
        <div className="max-w-2xl">
          <EmailForm /> {/* Replaces CreateForm with EmailForm */}
        </div>
      </PageWrapper>
    </>
  );
}
