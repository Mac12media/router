"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CircleAlert } from "lucide-react";

// Define dummy events for the calendar
const events = [
  { date: "2025-06-15", title: "First Contact" },
];

type UserProfile = Record<string, string | null | undefined>;

const generateCalendarGrid = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  
  const calendarDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentYear, currentMonth, i);
    calendarDays.push(date.toISOString().split('T')[0]);
  }

  return calendarDays;
};

export const RecruitingCalendar = ({ user }: { user?: UserProfile }) => {
  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle >Recruiting Calendar</CardTitle>
          <CardDescription className="text-xs">Loading user profile...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const calendarDays = generateCalendarGrid();
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format


  return (
    <Card className="w-full flex flex-col">
      <CardHeader className="mb-2 border-b">
        <CardTitle >Recruiting Calendar</CardTitle>
        <CardDescription className="text-xs">Track your recruiting events for the month.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="grid grid-cols-7 gap-1 text-xs mb-3">
          {/* Weekday headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center">{day}</div>
          ))}

   {calendarDays.map((date) => {
            const dayEvents = events.filter((event) => event.date === date);
            const isToday = date === today;

            return (
<div
                key={date}
                className={`relative p-1 border rounded-sm text-center text-xs ${
                  isToday ? 'bg-[#FF7200]' : ''
                }`}
              >                <div>{new Date(date).getDate()}</div>
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 text-ellipsis overflow-hidden text-[4px] text-[#FF7200]">
                    {dayEvents[0].title}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center mt-2 text-xs">
          <p className="italic text-muted-foreground">📅 Track recruiting dates.</p>

          {events.length === 0 && (
            <div className="flex items-center gap-1 text-[#FF7200]">
              <CircleAlert className="h-3 w-3" />
              <span>No events this month.</span>
            </div>
          )}

          <Link
            href="/profile"
            className="text-blue-600 underline hover:text-blue-800 text-xs"
          >
            Go to Profile
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
