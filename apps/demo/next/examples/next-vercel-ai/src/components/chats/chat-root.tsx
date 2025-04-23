import { SidebarTrigger } from "../ui/sidebar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { BookOpen } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import BasicDocs from "@/docs/basic-docs.mdx";

type ChatRootParams = {
  readonly MarkdownContent: typeof BasicDocs;
  readonly children?: React.ReactNode;
};

export default function ChatRoot({
  children,
  MarkdownContent,
}: ChatRootParams) {
  return (
    <>
      <div className="flex items-center justify-between md:justify-start md:gap-4 mb-4 px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger
            className="h-8 w-8 hover:cursor-pointer"
            variant="outline"
          />
          <div className="lg:hidden">
            <Drawer>
              <DrawerTrigger
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "hover:cursor-pointer"
                )}
              >
                <BookOpen />
                Explain
                <span className="sr-only">Toggle Explanation</span>
              </DrawerTrigger>
              <DrawerContent>
                <div className="w-full overflow-y-scroll">
                  <DrawerHeader className="pb-0">
                    <DrawerTitle>Basic</DrawerTitle>
                    <DrawerDescription>
                      Explanation of basic functionality within Vercel AI-sdk
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4 pb-0">
                    <MarkdownContent />
                  </div>
                </div>
                <DrawerFooter className="sticky bottom-2 w-full bg-background">
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <div className="flex items-center justify-center md:w-max">
          <picture className="size-10">
            <img alt="Front-end Accelerator" src="/logo.svg" />
          </picture>
          <h1 className="flex items-center gap-3 font-bold md:text-2xl">
            <span>Nextjs Vercel AI</span>
          </h1>
        </div>
      </div>
      <div className="flex gap-4 h-[calc(100%-3rem)] w-full">
        <div className="p-4 h-full w-1/3 overflow-y-scroll hidden lg:block">
          <BasicDocs />
        </div>
        <div className="flex flex-col p-4 w-full">{children}</div>
      </div>
    </>
  );
}
