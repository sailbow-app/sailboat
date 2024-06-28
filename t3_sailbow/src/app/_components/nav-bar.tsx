import { UserDropdown } from "./user-dropdown";
import NotificationsDropdown from "./notifications-dropdown";
import Crumbs from "./crumbs";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import { Spinner } from "./spinner";
import Sidebar from "./side-bar";
import BoatSearch from "./boat-search/boat-search";
import SignInButton from "./sign-in-button";

export function Navbar() {
  return (
    <header
      className="
  fixed top-0 z-40 flex max-h-navbar-height min-h-navbar-height w-full items-center
  gap-2 border-b-[1px] border-border/40 bg-background/90 xs:px-4 sm:gap-4"
    >
      <Image
        width={24}
        height={24}
        src="/icon.svg"
        alt="Sailbow Icon"
        className="hidden xs:flex"
      />
      <SignedIn>
        <div className="hidden xs:flex">
          <Crumbs />
        </div>
        <div className="flex items-center xs:hidden">
          <Sidebar />
          <BoatSearch />
        </div>
      </SignedIn>
      <div className="ml-auto flex items-center gap-2">
        <ClerkLoading>
          <Spinner />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <NotificationsDropdown />
            <UserDropdown />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </ClerkLoaded>
      </div>
    </header>
  );
}
