import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { serverEnv } from "@/env.mjs";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

const handler = async (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ req }),
    onError:
      serverEnv.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };