"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, Loader2, RefreshCw } from "lucide-react";
import api from "@/lib/api";

// 🧩 Types
interface Doctor {
  publicId: string;
  name: string;
  contact?: string;
  gender?: string;
  designation?: string;
  salary?: number;
  workingStart?: string;
  workingEnd?: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 📋 Component
export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 📡 Fetch doctors
  const fetchDoctors = async (page = 1, searchTerm = "") => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/admin/doctors", {
        params: { page, limit: pagination.limit, search: searchTerm },
      });

      setDoctors(res.data.data);
      setPagination(res.data.pagination);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ Error fetching doctors:", err);
      const msg =
        err.response?.data?.message ||
        "Failed to load doctors. Please try again.";
      setError(msg);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete doctor
  const handleDeleteDoctor = async (publicId: string) => {
    try {
      setLoading(true);
      await api.delete(`/admin/delete-doctor/${publicId}`);

      // ✅ Remove deleted doctor from UI without refetching full list
      setDoctors((prev) => prev.filter((doc) => doc.publicId !== publicId));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ Error deleting doctor:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Effects
  useEffect(() => {
    fetchDoctors(pagination.page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, search]);

  // 🧠 Helpers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // 💄 Render
  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-sm border border-gray-200">
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Doctors Management
          </CardTitle>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Search doctors..."
              value={search}
              onChange={handleSearchChange}
              className="w-[200px] sm:w-[250px]"
            />

            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchDoctors(pagination.page, search)}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? "animate-spin text-purple-600" : ""
                }`}
              />
            </Button>

            <Link href="/dashboard/doctors/new-doctor">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Doctor
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          {/* Loading */}
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
            </div>
          ) : error ? (
            <p className="text-center text-red-600 py-6">
              {"Error: Server down"}
            </p>
          ) : doctors.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No doctors found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Public ID</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {doctors.map((doctor, i) => (
                    <TableRow
                      key={doctor.publicId}
                      className={`${
                        i % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-purple-50 transition-colors`}
                    >
                      <TableCell>{doctor.publicId}</TableCell>
                      <TableCell>{doctor.name}</TableCell>
                      <TableCell>{doctor.contact || "-"}</TableCell>
                      <TableCell>{doctor.gender || "-"}</TableCell>
                      <TableCell>{doctor.designation || "-"}</TableCell>
                      <TableCell>
                        {doctor.salary
                          ? `Rs. ${doctor.salary.toLocaleString()}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {doctor.workingStart?.slice(0, 5) || "-"}
                      </TableCell>
                      <TableCell>
                        {doctor.workingEnd?.slice(0, 5) || "-"}
                      </TableCell>
                      <TableCell className="flex justify-center gap-2">
                        <Link
                          href={`/dashboard/doctors/edit-doctor/${doctor.publicId}`}
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            className="hover:bg-purple-100"
                          >
                            <Pencil className="h-4 w-4 text-gray-700" />
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          size="icon"
                          className="hover:bg-red-100"
                          onClick={() => handleDeleteDoctor(doctor.publicId)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!loading && doctors.length > 0 && (
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <p>
                Page {pagination.page} of {pagination.totalPages} — Total:{" "}
                {pagination.total}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() =>
                    setPagination((p) => ({ ...p, page: p.page - 1 }))
                  }
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() =>
                    setPagination((p) => ({ ...p, page: p.page + 1 }))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
