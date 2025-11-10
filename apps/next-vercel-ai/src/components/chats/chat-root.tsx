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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";

type ChatRootParams = {
  readonly drawerTitle?: string;
  readonly drawerDescription?: string;
  readonly MarkdownContent?: typeof BasicDocs;
  readonly children?: React.ReactNode;
};

export default function ChatRoot({
  children,
  drawerTitle,
  drawerDescription,
  MarkdownContent,
}: ChatRootParams) {
  return (
    <>
      <div className="flex items-center justify-between lg:justify-start md:gap-4 mb-4 px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger
            className="h-8 w-8 hover:cursor-pointer"
            variant="outline"
          />
          {MarkdownContent && (
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
                      <DrawerTitle>{drawerTitle}</DrawerTitle>
                      <DrawerDescription className="text-sm text-muted-foreground">
                        {drawerDescription}
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
          )}
        </div>
        <div className="flex items-center justify-center md:w-max">
          <picture className="size-10">
            <img alt="Front-end Accelerator" src="/logo.svg" />
          </picture>
          <h1 className="flex items-center gap-3 font-bold lg:text-2xl">
            <span>Nextjs Vercel AI</span>
          </h1>
        </div>
      </div>

      <div className="flex gap-4 h-[calc(100%-3rem)] w-full">
        <ResizablePanelGroup direction="horizontal">
          {MarkdownContent && (
            <ResizablePanel
              defaultSize={25}
              minSize={10}
              className="hidden lg:block"
            >
              <div className="p-4 pr-0 mr-4 h-full overflow-y-scroll">
                <MarkdownContent />
              </div>
            </ResizablePanel>
          )}

          {MarkdownContent && <ResizableHandle className="hidden lg:block" />}

          <ResizablePanel
            defaultSize={75}
            minSize={25}
            className="flex flex-col p-4"
          >
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
