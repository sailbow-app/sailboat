"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useBoat } from "@/hooks/use-boat";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { useConvexMutation } from "@/lib/convex-client-helpers";
import { useState } from "react";

export default function DeleteBoat() {
  const { _id } = useBoat();
  const router = useRouter();

  const [wasDeleted, setWasDeleted] = useState(false);
  const { mutate: deleteTrip, isLoading } = useConvexMutation(
    api.trips.mutations.deleteTrip,
    {
      onSuccess: () => {
        setWasDeleted(true);
        toast.success("Deleted successfully. Taking you back to your trips...");
        router.push("/dock");
        router.refresh();
      },
      onError: () =>
        toast.error("Something went wrong, please try again later."),
    },
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
        <CardDescription>These actions cannot be undone</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete boat</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete this boat?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone!
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => deleteTrip({ tripId: _id })}
                disabled={isLoading || wasDeleted}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
