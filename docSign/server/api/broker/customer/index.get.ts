import { getCustomersService } from "~~/server/services/customer/customer.service";
import { handleErrorCatch } from "~~/server/utils/errorHandler";

export default defineEventHandler(async () => {
  try {
    return await getCustomersService();
  } catch (err: unknown) {
    if (err instanceof Error) {
      const statusCode =
        "statusCode" in err ? Number((err as Error & { statusCode?: number }).statusCode) : 500;
      return handleErrorCatch(statusCode, err.message);
    }

    return handleErrorCatch(500, "Internal Server Error");
  }
});