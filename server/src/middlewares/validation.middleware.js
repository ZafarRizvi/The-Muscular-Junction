/**
 * Generic Zod validation middleware
 * Formats errors as { field: message } for clean API responses
 */
export const validationMiddleware = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    // If it's a ZodError, format it nicely
    if (err.errors && Array.isArray(err.errors)) {
      const formatted = {};
      for (const e of err.errors) {
        const field = e.path.join(".") || "unknown";
        formatted[field] = e.message;
      }

      return res.status(400).json({
        message: "Validation failed",
        errors: formatted,
      });
    }

    // Fallback (non-Zod errors)
    return res.status(400).json({
      message: "Validation failed",
      errors: { general: err.message },
    });
  }
};
