import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import Link from "next/link";

import { Progress } from "@/components/ui/progress";
import { CircleAlert, ArrowUp } from "lucide-react";
import { Badge } from "../ui/badge";

export const RecruitingTasks = ({
  tasks,
  totalSteps,
}: {
  tasks: RecruitingTask[]; // Array of recruiting tasks
  totalSteps: number; // Total number of steps per task (e.g., number of students to follow up with)
}) => {
  const calculateDaysLeft = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Card className="w-full flex flex-col">
      <CardHeader className="mb-6 border-b">
        <CardTitle>Recruiting Task Overview</CardTitle>
        <CardDescription>Track your high school recruiting tasks.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 flex-grow">
        {tasks.map((task, index) => {
          const daysLeft = calculateDaysLeft(task.dueDate);
          const taskCompletionPercentage = (task.completed / totalSteps) * 100;

          return (
            <div
              key={index}
              className="grid gap-3 p-3 border rounded-sm bg-muted/25"
            >
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">{task.name}</p>
                <Badge variant={task.status === "In Progress" ? "default" : "outline"}>
                  {task.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{task.category}</p>
              <Progress value={taskCompletionPercentage} className="h-2" />
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  {task.completed} of {totalSteps} steps completed
                </p>
                <p className="flex items-center space-x-1 text-xs">
                  <CircleAlert className="h-3 w-3 text-yellow-500" />
                  <span>
                    Task due in <span className="font-medium">{daysLeft}</span>{" "}
                    day{daysLeft !== 1 ? "s" : ""}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>

      <CardFooter className="mt-auto">
        <AddNewRecruitingTask />
      </CardFooter>
    </Card>
  );
};

const AddNewRecruitingTask = () => {
  return (
    <Link
      href="/recruiting/tasks/add"
      target="_blank"
      rel="noopener noreferrer"
      className="p-4 hover:pl-5 hover:pr-3 transition-all h-full w-full border grid gap-1 border-blue-500 rounded-sm bg-blue-500/15 hover:bg-blue-500/25"
    >
      <span className="flex items-center gap-1">
        Add New Recruiting Task
        <ArrowUp className="h-4 w-4" />
      </span>
      <span className="text-muted-foreground text-xs">
        Add a new recruiting task to your to-do list
      </span>
    </Link>
  );
};
