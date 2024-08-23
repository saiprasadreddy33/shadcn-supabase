"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation"; // For redirection
import { Icons } from "./icons";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true); // Toggle between sign-in and sign-up
  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    // Replace this with real authentication logic
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard"); // Redirect to dashboard on success
    }, 3000);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="flex justify-center space-x-4">
        <Button
          variant={isSignIn ? "default" : "outline"}
          onClick={() => setIsSignIn(true)}
        >
          Sign In
        </Button>
        <Button
          variant={!isSignIn ? "default" : "outline"}
          onClick={() => setIsSignIn(false)}
        >
          Sign Up
        </Button>
      </div>

      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : isSignIn ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}