"use client";

import { Button, buttonVariants } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Key, Trash2 } from "lucide-react";
import { toast } from "sonner";

import CreateApiKeyDialog from "./CreateApiKeyDialog";
import { useBotApi } from "@/components/bot-context";
import { formatDate } from "@/lib/utils";
import { deleteApiKey } from "./apiActions";
import { useTransition } from "react";

export default function ApiConfig() {
  const { api: apiKeys, setApi } = useBotApi();

  const [isPending, startTransition] = useTransition();
  function handleDeleteClick(api_id: string) {
    startTransition(async () => {
      const result = await deleteApiKey(api_id);

      if (!result.ok) {
        toast.error(result.message || "Failed to delete API key");
        return;
      }

      setApi((prev) => prev.filter((key) => key.api_id !== api_id));
      toast.success("API key deleted");
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="space-y-2 mb-12">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          API Integration
        </h1>
        <p className="text-muted-foreground">
          Configure your AI bot&apos;s api api keys.
        </p>
      </div>

      {/* Card */}
      <div className="w-full">
        <header className="space-y-4">
          <div className="flex mb-4 justify-end">
            <div className="flex justify-center items-center gap-2">
              <Button variant="outline" className="w-fit ">
                {apiKeys.length} / 3 keys
              </Button>
              <CreateApiKeyDialog />
            </div>
          </div>
        </header>

        {/* Table */}

        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead>Project #</TableHead>
                  <TableHead>Key name</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Created at</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {apiKeys.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Key className="h-8 w-8" />
                        <p>No keys yet — create one!</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  apiKeys.map((k) => (
                    <TableRow
                      key={k.id}
                      className="hover:bg-muted/40 border-border"
                    >
                      <TableCell className="font-mono text-sm">
                        ...{k.bot_id.slice(-6)}
                      </TableCell>
                      <TableCell>
                        {k.name[0].toUpperCase() + k.name.slice(1)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                            {k.permissions?.length
                              ? k.permissions.join(", ")
                              : "No permissions"}
                          </code>
                        </div>
                      </TableCell>

                      <TableCell>{formatDate(k.created_at)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">free</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isPending}
                          className={buttonVariants({
                            variant: "destructive",
                            size: "icon",
                          })}
                          onClick={() => handleDeleteClick(k.api_id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Notice */}
      <p className="text-sm text-muted-foreground">
        Keep your API keys secret. Use them only on secure environments. Usage
        is billed according to{" "}
        <a href="#" className="text-primary underline hover:opacity-80">
          pay-as-you-go pricing
        </a>
        .
      </p>
    </div>
  );
}
