"use client";

import React, { JSX, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  Stethoscope,
  UserCog,
  DollarSign,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "@/lib/api";

// Data Types
interface SessionData {
  date: string;
  sessions: number;
}
interface Patient {
  name: string;
  age: number;
  contact: string;
  date: string;
}
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

// Dummy Data
const sessionsData: SessionData[] = [
  { date: "Mon", sessions: 12 },
  { date: "Tue", sessions: 13 },
  { date: "Wed", sessions: 12 },
  { date: "Thu", sessions: 14 },
  { date: "Fri", sessions: 13 },
  { date: "Sat", sessions: 12 },
  { date: "Sun", sessions: 11 },
];
const patientsData: Patient[] = [
  {
    name: "Ali Raza",
    age: 29,
    contact: "0301-1234567",
    date: "Oct 25",
  },
  {
    name: "Sara Khan",
    age: 34,
    contact: "0321-7654321",
    date: "Oct 24",
  },
  {
    name: "Bilal Ahmed",
    age: 41,
    contact: "0333-9876543",
    date: "Oct 23",
  },
];

// Main Dashboard Component
export default function DashboardPage(): JSX.Element {
  const [doctorCount, setDoctorCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDoctorCount = async () => {
      try {
        setLoading(true);
        // 👇 call the actual endpoint
        const res = await api.get("/admin/doctors/count");

        // axios puts the parsed JSON directly in res.data
        setDoctorCount(res.data.totalDoctors || 0);
      } catch (error) {
        console.error("❌ Error fetching doctor count:", error);
        setDoctorCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorCount();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold">Clinic Admin Dashboard</h1>

      {/* Top Stats */}
      <div className="grid gap-6 md:grid-cols-4 sm:grid-cols-2">
        <StatCard
          title="Doctors"
          value={loading ? "..." : doctorCount ?? "0"}
          icon={<Stethoscope className="h-6 w-6 text-blue-500" />}
        />
        <StatCard
          title="Receptionists"
          value="0"
          icon={<UserCog className="h-6 w-6 text-green-500" />}
        />
        <StatCard
          title="Patients"
          value="0"
          icon={<Users className="h-6 w-6 text-purple-500" />}
        />
        <StatCard
          title="Appointments Today"
          value="0"
          icon={<Calendar className="h-6 w-6 text-orange-500" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sessions Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Sessions (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sessionsData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sessions" fill="#9810fa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Summary */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">This Week</span>
              <span className="font-semibold">Rs. 4,200</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Week</span>
              <span className="font-semibold">Rs. 3,870</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Monthly Goal</span>
              <span className="font-semibold">Rs. 18,000</span>
            </div>
            <Button className="w-full mt-2" variant="default">
              <DollarSign className="h-4 w-4 mr-2" /> View Detailed Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Registrations */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Patient Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left text-gray-600">Name</th>
                <th className="py-2 text-left text-gray-600">Age</th>
                <th className="py-2 text-left text-gray-600">Contact</th>
                <th className="py-2 text-left text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {patientsData.map((p, i) => (
                <tr key={i} className="border-b hover:bg-gray-100">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2">{p.age}</td>
                  <td className="py-2">{p.contact}</td>
                  <td className="py-2">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

// ----------------------
// Stat Card Component
// ----------------------
function StatCard({ title, value, icon }: StatCardProps): JSX.Element {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between hover:scale-105 hover:bg-purple-200 transition-transform duration-150">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-semibold">{value}</h3>
      </div>
      <div className="p-3 bg-gray-100 rounded-xl">{icon}</div>
    </div>
  );
}
