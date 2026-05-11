import { Role } from "@prisma/client";

// ──────────────────────────────────────────────────────────────
// Extend Express Request to include authenticated user payload
// ──────────────────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
      };
    }
  }
}

export {};
