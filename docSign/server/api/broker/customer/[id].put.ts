import { updateCustomerService } from "~~/server/services/customer/customer.service";
import { handleErrorCatch } from "~~/server/utils/errorHandler";
import type { IUpdateCustomer } from "~~/server/types/customer.types";
import { ObjectId } from "mongoose";

export default defineEventHandler(async (event) => {
  try {
    const { id } = event.context.params as { id: string };

    const body = (await readBody(event)) as IUpdateCustomer;

    const brokerId = event.context.broker._id as string | ObjectId;

    return await updateCustomerService(id, body, brokerId);
  } catch (err: unknown) {
    if (err instanceof Error) {
      const statusCode =
        "statusCode" in err
          ? Number((err as Error & { statusCode?: number }).statusCode)
          : 500;
      return handleErrorCatch(statusCode, err.message);
    }

    return handleErrorCatch(500, "Internal Server Error");
  }
});
