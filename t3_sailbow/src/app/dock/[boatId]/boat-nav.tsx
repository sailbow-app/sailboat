"use client";

import Link from "next/link";
import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname } from "next/navigation";

interface BoatNavProps {
  links: {
    title: string;
    href: string;
    label?: string;
    icon: LucideIcon;
  }[];
}

export function BoatNav({ links }: BoatNavProps) {
  const isSm = useMediaQuery("(max-width: 640px)");
  const path = usePathname();
  return (
    <nav className="flex justify-between sm:flex-col sm:justify-normal sm:gap-4">
      {links.map((link, index) =>
        isSm ? (
          <Tooltip key={index} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href={link.href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-9 w-9",
                  path == link.href && "bg-accent text-accent-foreground",
                )}
              >
                <link.icon className="h-4 w-4" />
                <span className="sr-only">{link.title}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-4">
              {link.title}
              {link.label && (
                <span className="ml-auto text-muted-foreground">
                  {link.label}
                </span>
              )}
            </TooltipContent>
          </Tooltip>
        ) : (
          <Link
            key={index}
            href={link.href}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              path === link.href && "bg-accent text-accent-foreground",
              "justify-start",
            )}
          >
            <link.icon className="mr-2 h-4 w-4" />
            {link.title}
            {link.label && <span className="ml-auto">{link.label}</span>}
          </Link>
        ),
      )}
    </nav>
  );
}
