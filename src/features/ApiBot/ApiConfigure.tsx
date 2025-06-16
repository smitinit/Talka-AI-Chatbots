"use client";

import { useState } from "react";
import {
  Button,
  buttonVariants, // <- if you use shadcn/ui variants
} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Copy, Key, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  projectNumber: string;
  projectName: string;
  apiKey: string;
  created: string;
  plan: string;
}

export default function ApiConfig() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const generateApiKey = () =>
    `gsk_${Math.random().toString(36).slice(2)}${Math.random()
      .toString(36)
      .slice(2)}`;

  const handleCreateApiKey = async () => {
    if (!keyName.trim()) return;
    setIsCreating(true);
    await new Promise((r) => setTimeout(r, 1_000));

    const newKey: ApiKey = {
      id: Math.random().toString(36).slice(2),
      projectNumber: Math.floor(Math.random() * 1_000_000_000).toString(),
      projectName: keyName,
      apiKey: generateApiKey(),
      created: new Date().toLocaleDateString(),
      plan: "Free",
    };

    setApiKeys((prev) => [...prev, newKey]);
    setKeyName("");
    setIsDialogOpen(false);
    setIsCreating(false);
    toast.success("API key created successfully");
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.info("API key copied to clipboard");
  };

  const handleDelete = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    toast.info("API key deleted");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2 mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            API Integration
          </h1>
          <p className="text-muted-foreground">
            Configure your AI bot&apos;s api api keys.
          </p>
        </div>
        {/* Card */}
        <Card className="bg-card border border-border">
          <CardHeader className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>API Key Management</CardTitle>
                <CardDescription>
                  Create and manage your API keys.
                </CardDescription>
              </div>

              {/* Create Key Dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create API Key
                  </Button>
                </DialogTrigger>

                <DialogContent className="bg-popover border border-border">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5 text-primary" />
                      Create New API Key
                    </DialogTitle>
                    <DialogDescription>
                      Enter a label to identify this key.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <Label htmlFor="keyName">API Key Name</Label>
                    <Input
                      id="keyName"
                      placeholder="e.g. My staging key"
                      value={keyName}
                      onChange={(e) => setKeyName(e.target.value)}
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateApiKey} disabled={isCreating}>
                      {isCreating ? "Creating…" : "Create API Key"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          {/* Table */}
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead>Project #</TableHead>
                      <TableHead>Project name</TableHead>
                      <TableHead>API key</TableHead>
                      <TableHead>Created</TableHead>
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
                            {k.projectNumber}
                          </TableCell>
                          <TableCell>{k.projectName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                                {k.apiKey.slice(0, 12)}…
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleCopy(k.apiKey)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>{k.created}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{k.plan}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={buttonVariants({
                                variant: "destructive",
                                size: "icon",
                              })}
                              onClick={() => handleDelete(k.id)}
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
          </CardContent>
        </Card>

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
    </div>
  );
}
