"use client";

import * as React from "react";
import { addDays, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

export function DatePickerWithRange({ className, date, setDate }) {
  const handleShortcut = (shortcut) => {
    if (shortcut === "thisWeek") {
      setDate({ from: startOfWeek(new Date()), to: endOfWeek(new Date()) });
    } else if (shortcut === "lastWeek") {
      const lastWeekStart = startOfWeek(subWeeks(new Date(), 1));
      const lastWeekEnd = endOfWeek(subWeeks(new Date(), 1));
      setDate({ from: lastWeekStart, to: lastWeekEnd });
    } else if (shortcut === "thisMonth") {
      setDate({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) });
    } else if (shortcut === "lastMonth") {
      const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
      const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));
      setDate({ from: lastMonthStart, to: lastMonthEnd });
    }
  };

  const handleDateChange = (field, value) => {
    setDate((prevDate) => ({
      ...prevDate,
      [field]: value ? new Date(value) : null,
    }));
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            size="lg"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4">
            <div className="flex gap-2 mb-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShortcut("thisWeek")}
              >
                This Week
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShortcut("lastWeek")}
              >
                Last Week
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShortcut("thisMonth")}
              >
                This Month
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShortcut("lastMonth")}
              >
                Last Month
              </Button>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col">
                <label>From:</label>
                <input
                  type="date"
                  value={date?.from ? format(date.from, "yyyy-MM-dd") : ""}
                  onChange={(e) => handleDateChange("from", e.target.value)}
                  className="p-2 border rounded"
                />
              </div>
              <div className="flex flex-col">
                <label>To:</label>
                <input
                  type="date"
                  value={date?.to ? format(date.to, "yyyy-MM-dd") : ""}
                  onChange={(e) => handleDateChange("to", e.target.value)}
                  className="p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
