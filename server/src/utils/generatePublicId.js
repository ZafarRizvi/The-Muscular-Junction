import prisma from "../config/prisma.js";

export async function generatePublicId(roleName, fullName) {
  // Step 1: Define prefix based on role
  const rolePrefixes = {
    Doctor: "D",
    Patient: "P",
    Receptionist: "R",
  };

  const prefix = rolePrefixes[roleName] || "U"; // fallback 'U' for unknown roles

  // Step 2: Get all existing public IDs for that role
  const users = await prisma.user.findMany({
    where: { role: { name: roleName } },
    select: { publicId: true },
  });

  // Step 3: Extract numeric parts (e.g., from D-01-AliKhamenai → 1)
  const numbers = users
    .map((user) => {
      if (!user.publicId) return 0;
      const match = user.publicId.match(new RegExp(`^${prefix}-(\\d+)-`));
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => !isNaN(n));

  // Step 4: Determine next number
  const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

  // Step 5: Format number with 2 digits (01, 02, ...)
  const numberPart = String(nextNumber).padStart(2, "0");

  // Step 6: Clean the name (remove spaces/special chars)
  const cleanName = fullName.replace(/[^a-zA-Z]/g, "");
  // Step 7: Construct final public ID
  const finalPublicID = `${prefix}-${numberPart}-${cleanName}`;
  return finalPublicID;
}
