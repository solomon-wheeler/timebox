"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Clock } from "lucide-react";
import { Alert } from "@/components/ui/alert";

interface TimeBox {
  id: string;
  activity: string;
  startTime: string;
  endTime: string;
  color: string; // Add color property
}

const colors = [
  "bg-red-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-purple-500",
];

export function TimeBoxing() {
  const [timeBoxes, setTimeBoxes] = useState<TimeBox[]>([]);
  const [newActivity, setNewActivity] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedTimeBoxes = localStorage.getItem("timeBoxes");
    if (storedTimeBoxes) {
      setTimeBoxes(JSON.parse(storedTimeBoxes));
    }
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    setStartTime(currentTime);
    const endTime = new Date(now.getTime() + 60 * 60 * 1000)
      .toTimeString()
      .slice(0, 5);
    setEndTime(endTime);
  }, []);

  useEffect(() => {
    localStorage.setItem("timeBoxes", JSON.stringify(timeBoxes));
  }, [timeBoxes]);

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    const [hours, minutes] = newStartTime.split(":").map(Number);
    const newEndTime = new Date();
    newEndTime.setHours(hours + 1, minutes);
    setEndTime(newEndTime.toTimeString().slice(0, 5));
  };

  const addTimeBox = () => {
    if (!newActivity) {
      setError("Please fill in task, and times");
      return;
    }
    if (newActivity && startTime && endTime) {
      const newTimeBox: TimeBox = {
        id: Date.now().toString(),
        activity: newActivity,
        startTime,
        endTime,
        color: colors[timeBoxes.length % colors.length], // Assign color
      };
      setTimeBoxes([...timeBoxes, newTimeBox]);
      setNewActivity("");
      setStartTime(endTime); // Set start time to the end time of the newly added timebox
      setEndTime("");
      setError("");
    }
  };

  const removeTimeBox = (id: string) => {
    setTimeBoxes(timeBoxes.filter((box) => box.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-purple-400 to-purple-500 p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          {" "}
          Time Box ⏲️📦
        </h1>
        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="activity" className="text-white">
              Task
            </Label>
            <Input
              id="activity"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              className="bg-white bg-opacity-20 border-none text-white placeholder-gray-300"
              placeholder="Enter activity"
            />
          </div>
          <div>
            <Label htmlFor="startTime" className="text-white">
              Start Time
            </Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              className="bg-white bg-opacity-20 border-none text-white placeholder-gray-300"
            />
          </div>
          <div>
            <Label htmlFor="endTime" className="text-white">
              End Time
            </Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="bg-white bg-opacity-20 border-none text-white placeholder-gray-300"
            />
          </div>
        </div>

        <Button
          onClick={addTimeBox}
          className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-2 border-white border-opacity-50 transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Time Box
        </Button>

        <div className="space-y-4">
          {timeBoxes.map((box) => (
            <div
              key={box.id}
              className={`${box.color} bg-opacity-20 rounded-lg p-4 flex items-center justify-between group hover:bg-opacity-30 transition-all duration-300`}
            >
              <div className="flex items-center space-x-4">
                <Clock className="h-6 w-6 text-white opacity-70" />
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {box.activity}
                  </h3>
                  <p className="text-sm text-gray-200">
                    {box.startTime} - {box.endTime}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => removeTimeBox(box.id)}
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <X className="h-4 w-4 text-black" />
                <p className="text-sm text-black-200">Done!</p>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
