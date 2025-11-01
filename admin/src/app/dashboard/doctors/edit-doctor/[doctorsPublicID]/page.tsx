"use client";

import { useParams } from "next/navigation";
import React from "react";

export default function EditDoctorPage() {
  // Get doctor ID from the dynamic route
  const { doctorsPublicID } = useParams();

  return (
    <div className="p-4 text-lg font-medium">
      Edit Doctor with ID:{" "}
      <span className="text-purple-600">{doctorsPublicID}</span>
    </div>
  );
}
