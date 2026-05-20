import { ObjectId } from "mongoose";
import { deleteCustomerService } from "~~/server/services/customer/customer.service";
import { handleErrorCatch } from "~~/server/utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const id = getQuery(event).id as string;

    const brokerId = event.context.broker._id as string | ObjectId

    return await deleteCustomerService(id,brokerId);
  } catch (err: unknown) {
    if (err instanceof Error) {
      const statusCode =
        "statusCode" in err ? Number((err as Error & { statusCode?: number }).statusCode) : 500;
      return handleErrorCatch(statusCode, err.message);
    }

    return handleErrorCatch(500, "Internal Server Error");
  }
});