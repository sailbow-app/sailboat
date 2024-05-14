"use client";
import { useActiveBoat } from "@/hooks/use-boat";
import { api } from "@/trpc/react";
import { useEffect } from "react";
import { type BoatTab } from "./tabs";
import { Button } from "@/components/ui/button";

import {
  Home,
  ListChecks,
  Megaphone,
  Settings,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { bannerSchema } from "@/lib/schemas/boat";
import BoatBannerView from "@/app/_components/boat-banner-view";
import NotFoundPage from "@/app/_components/not-found-page";
import { Spinner } from "@/app/_components/spinner";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { BoatNav } from "./boat-nav";
import { useMediaQuery } from "@/hooks/use-media-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import CenteredSpinner from "@/app/_components/centered-spinner";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    boatId: number;
    tab: BoatTab | null | undefined;
  };
}) {
  const {
    data: boat,
    error,
    isLoading,
  } = api.dock.getBoatById.useQuery(
    {
      boatId: params.boatId,
    },
    {
      retry: false,
    },
  );
  const { activeBoat, setActiveBoat, setError } = useActiveBoat();

  // Reset active boat on mount
  useEffect(() => {
    if (setActiveBoat) setActiveBoat(null);
  }, [setActiveBoat]);

  useEffect(() => {
    if (boat && setActiveBoat) {
      setActiveBoat(boat);
    }
  }, [boat, setActiveBoat]);

  useEffect(() => {
    if (error) {
      console.error(error);
      if (setError) {
        setError({
          code: error.data?.code ?? "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
    }
  }, [error, setError]);

  if (!isLoading && error && error.data?.code === "NOT_FOUND") {
    return <NotFoundPage />;
  }

  // if (isLoading || !activeBoat) {
  //   return <CenteredSpinner />;
  // }

  return (
    <div className="size-full">
      <div className="top-0 h-40 w-full">
        <BoatBannerView banner={bannerSchema.nullish().parse(activeBoat)} />
      </div>

      <div className="h-[calc(theme(spacing.main-height) - 1rem)] flex flex-col gap-4 overflow-y-auto p-2 sm:flex-row sm:p-4">
        <TooltipProvider delayDuration={0}>
          <BoatNav
            links={[
              {
                title: "Overview",
                label: "",
                icon: Home,
                href: `/dock/${params.boatId}`,
              },
              {
                title: "Itinerary",
                label: "",
                icon: ListChecks,
                href: `/dock/${params.boatId}/itinerary`,
              },
              {
                title: "Crew",
                label: "",
                icon: UsersRound,
                href: `/dock/${params.boatId}/crew`,
              },
              {
                title: "Announcements",
                label: "",
                icon: Megaphone,
                href: `/dock/${params.boatId}/announcements`,
              },
              {
                title: "Settings",
                label: "",
                icon: Settings,
                href: `/dock/${params.boatId}/settings`,
              },
            ]}
          />
          <div className="grow">{children}</div>
        </TooltipProvider>
      </div>
    </div>
  );
}
