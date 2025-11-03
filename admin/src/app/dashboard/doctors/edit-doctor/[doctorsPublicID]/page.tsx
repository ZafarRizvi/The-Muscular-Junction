"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  gender: z
    .enum(["Male", "Female"])
    .refine((val) => val === "Male" || val === "Female", {
      message: "Select a gender",
    }),
  contact: z.string().min(10, "Contact is required"),
  address: z.string().min(5, "Address is required"),
  latestDegree: z.string().min(2, "Degree is required"),
  designation: z
    .enum(["Intern", "Senior"])
    .refine((val) => val === "Intern" || val === "Senior", {
      message: "Select a designation",
    }),
  salary: z.string().min(1, "Salary is required"),
  startTime: z.string().min(1, "Start time required"),
  endTime: z.string().min(1, "End time required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditDoctorPage() {
  const { doctorsPublicID } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverMessage, setServerMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      gender: "Male",
      contact: "",
      address: "",
      latestDegree: "",
      designation: "Intern",
      salary: "",
      startTime: "",
      endTime: "",
    },
  });

  const { register, handleSubmit, reset, formState } = form;
  const { errors, isDirty } = formState;

  // 📡 Fetch doctor details on mount
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/admin/doctor/${doctorsPublicID}`);
        const d = data.doctor;

        const normalized: FormValues = {
          fullName: d.name || "",
          email: d.email || "",
          password: "",
          gender: d.gender || "Male",
          contact: d.contact || "",
          address: d.address || "",
          latestDegree: d.doctorDetails?.degree || "",
          designation: d.doctorDetails?.designation || "Intern",
          salary: d.salaries?.at(-1)?.amount?.toString() || "",
          startTime: d.doctorDetails?.workingStart?.slice(11, 16) || "",
          endTime: d.doctorDetails?.workingEnd?.slice(11, 16) || "",
        };

        reset(normalized); // ✅ Populate form fields
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("❌ Error fetching doctor:", err);
        setServerMessage({
          text: "Server Error while fetching doctor.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (doctorsPublicID) fetchDoctor();
  }, [doctorsPublicID, reset]);

  // 💾 Save Handler
  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    setServerMessage(null);

    try {
      await api.put(`/admin/edit-doctor/${doctorsPublicID}`, {
        fullName: values.fullName,
        email: values.email,
        gender: values.gender,
        contact: values.contact,
        address: values.address,
        latestDegree: values.latestDegree,
        designation: values.designation,
        salary: values.salary,
        startTime: values.startTime,
        endTime: values.endTime,
        ...(values.password && { password: values.password }),
      });

      setServerMessage({
        text: "Doctor updated successfully!",
        type: "success",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ Update failed:", err);
      setServerMessage({
        text: err.response?.data?.message || "Failed to update doctor.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // 🌀 Loading State
  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Edit Doctor
          </CardTitle>
          <Link href="/dashboard/doctors">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Text Inputs */}
            {[
              { label: "Full Name", name: "fullName", type: "text" },
              { label: "Email", name: "email", type: "email" },
              {
                label: "Password",
                name: "password",
                type: "password",
                placeholder: "Enter new password",
              },
              { label: "Contact", name: "contact", type: "text" },
              { label: "Address", name: "address", type: "text" },
              { label: "Latest Degree", name: "latestDegree", type: "text" },
              { label: "Salary (Rs)", name: "salary", type: "number" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <Input
                  type={field.type}
                  placeholder={field.placeholder}
                  {...register(field.name as keyof FormValues)}
                />
                {errors[field.name as keyof FormValues] && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors[field.name as keyof FormValues]?.message as string}
                  </p>
                )}
              </div>
            ))}

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                {...register("gender")}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Designation
              </label>
              <select
                {...register("designation")}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="Intern">Intern</option>
                <option value="Senior">Senior</option>
              </select>
              {errors.designation && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.designation.message}
                </p>
              )}
            </div>

            {/* Working Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <Input type="time" {...register("startTime")} />
                {errors.startTime && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.startTime.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <Input type="time" {...register("endTime")} />
                {errors.endTime && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                disabled={!isDirty || saving}
                className={cn(
                  "bg-purple-600 hover:bg-purple-700 text-white transition-colors",
                  (!isDirty || saving) && "opacity-60 cursor-not-allowed"
                )}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>

              {serverMessage && (
                <p
                  className={cn(
                    "text-sm font-medium transition-opacity",
                    serverMessage.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {serverMessage.text}
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
