"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CircleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type UserProfile = Record<string, string | null | undefined>;

const events = [
  { date: "2025-06-15", title: "First Contact" },
];

const generateCalendarGrid = (year: number, month: number) => {
  const firstDay = new Date(Date.UTC(year, month, 1));
  const lastDay = new Date(Date.UTC(year, month + 1, 0));

  const daysInMonth = lastDay.getUTCDate();
  const startDay = firstDay.getUTCDay(); // 0 = Sunday, 6 = Saturday
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

  const calendarGrid = [];

  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startDay + 1;

    if (i < startDay || dayNum > daysInMonth) {
      calendarGrid.push(null); // empty cell
    } else {
      const date = new Date(Date.UTC(year, month, dayNum));
      calendarGrid.push(date.toISOString().split("T")[0]);
    }
  }

  return calendarGrid;
};


export const RecruitingCalendar = ({ user }: { user?: UserProfile }) => {
  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recruiting Calendar</CardTitle>
          <CardDescription className="text-xs">Loading user profile...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const calendarDays = generateCalendarGrid(currentYear, currentMonth);

  const upcomingEvents = events.filter((event) => event.date > todayStr);

  return (
    <Card className="w-full flex flex-col">
      <CardHeader className="mb-2 border-b">
        <CardTitle>Recruiting Calendar</CardTitle>
        <CardDescription className="text-xs">Track your recruiting events for the month.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="grid grid-cols-7 gap-1 text-xs mb-3">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold">
              {day}
            </div>
          ))}

          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="p-1">&nbsp;</div>;
            }

            const isToday = date === todayStr;
            const dayEvents = events.filter((event) => event.date === date);

            return (
              <div
                key={date}
                className={`relative p-1 border rounded-sm text-center text-xs ${
                  isToday ? "bg-[#FF7200] text-white font-bold" : ""
                }`}
              >
                <div>{new Date(date).getDate()}</div>
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 text-[4px] text-[#FF7200] overflow-hidden">
                    {dayEvents[0].title}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {events.length === 0 && (
          <div className="flex items-center gap-1 text-[#FF7200] text-xs">
            <CircleAlert className="h-3 w-3" />
            <span>No events this month.</span>
          </div>
        )}

        {/* Upcoming Events */}
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-semibold">Upcoming Events</h3>
          {upcomingEvents.length > 0 ? (
            <ul className="space-y-1 text-xs">
              {upcomingEvents.map((event) => (
                <li key={event.date} className="flex justify-between items-center">
                  <span>{event.title}</span>
                  <span className="text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">No upcoming events.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
