import { ZodError } from "zod";

/**
 * ✅ Universal Zod validation middleware
 * Safely validates body/query/params and formats errors cleanly.
 * Works even if multiple Zod versions exist.
 */
export const validationMiddleware = (schema) => (req, res, next) => {
  try {
    // Handle schema in { body, query, params } format or single schema
    if (schema?.body) req.body = schema.body.parse(req.body);
    else if (schema?.parse) req.body = schema.parse(req.body);

    if (schema?.query) req.query = schema.query.parse(req.query);
    if (schema?.params) req.params = schema.params.parse(req.params);

    next();
  } catch (err) {
    const isZod =
      err instanceof ZodError ||
      (err?.name === "ZodError" && Array.isArray(err?.issues || err?.errors));

    if (isZod) {
      const issues = err.issues || err.errors || [];
      const formatted = {};

      for (const issue of issues) {
        const field = issue?.path?.join?.(".") || "unknown";
        formatted[field] = issue?.message || "Invalid value";
      }

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formatted,
      });
    }

    console.error("❌ Validation Middleware Internal Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal validation error.",
      errors: { general: err?.message || "Unexpected error" },
    });
  }
};
