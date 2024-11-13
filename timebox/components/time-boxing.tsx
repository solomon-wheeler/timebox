"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Clock } from "lucide-react";

interface TimeBox {
  id: string;
  activity: string;
  startTime: string;
  endTime: string;
}

export function TimeBoxing() {
  const [timeBoxes, setTimeBoxes] = useState<TimeBox[]>([]);
  const [newActivity, setNewActivity] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    const storedTimeBoxes = localStorage.getItem("timeBoxes");
    if (storedTimeBoxes) {
      setTimeBoxes(JSON.parse(storedTimeBoxes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("timeBoxes", JSON.stringify(timeBoxes));
  }, [timeBoxes]);

  const addTimeBox = () => {
    if (newActivity && startTime && endTime) {
      const newTimeBox: TimeBox = {
        id: Date.now().toString(),
        activity: newActivity,
        startTime,
        endTime,
      };
      setTimeBoxes([...timeBoxes, newTimeBox]);
      setNewActivity("");
      setStartTime("");
      setEndTime("");
    }
  };

  const removeTimeBox = (id: string) => {
    setTimeBoxes(timeBoxes.filter((box) => box.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-purple-400 to-purple-500 p-8 flex flex-col items-center justify-center">
      {" "}
      <div className="w-full max-w-4xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          {" "}
          Time Box ⏲️📦
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="activity" className="text-white">
              Activity
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
              onChange={(e) => setStartTime(e.target.value)}
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
              className="bg-white bg-opacity-20 rounded-lg p-4 flex items-center justify-between group hover:bg-opacity-30 transition-all duration-300"
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
                <X className="h-4 w-4 text-white" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}