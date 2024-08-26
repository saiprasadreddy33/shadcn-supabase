"use client";
import React, { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/authService";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner className="w-8 h-8 text-gray-500" />
      </div>
    );
  }

  return (
    <div className=" bg-gray-100 p-2">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src="https://avatars.dicebear.com/api/initials/example.svg" alt="User Avatar" />
              <AvatarFallback>{user?.first_name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-bold">{user.first_name || user.email}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <Badge variant="secondary" className="mt-2">User ID: {user.userId}</Badge>
          </CardHeader>
          <CardContent className="mt-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="personal-info">
                <AccordionTrigger className="text-lg font-semibold">Personal Information</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-600">First Name</span>
                      <span className="text-lg text-gray-800">{user.first_name || "N/A"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-600">Last Name</span>
                      <span className="text-lg text-gray-800">{user.last_name || "N/A"}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="account-details">
                <AccordionTrigger className="text-lg font-semibold">Account Details</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-600">Email</span>
                      <span className="text-lg text-gray-800">{user.email}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-600">User ID</span>
                      <span className="text-lg text-gray-800">{user.userId}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="mt-8 flex justify-end">
              <Button variant="outline">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`animate-spin ${className}`}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};
