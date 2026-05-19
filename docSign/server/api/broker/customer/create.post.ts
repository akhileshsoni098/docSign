import { createCustomerService } from "~~/server/services/customer/customer.service";
import { handleError, handleErrorCatch } from "~~/server/utils/errorHandler";
import type { ICreateCustomer } from "~~/server/types/customer.types";
import type { HttpErrorWithStatus } from "~~/server/utils/http-error";

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as ICreateCustomer;

    if (!body.name || !body.email || !body.phone) {
      return handleError(event, 400, "Provide customer details");
    }

    return await createCustomerService(body);
  } catch (err: unknown) {
    if (err instanceof Error) {
      const statusCode = (err as HttpErrorWithStatus).statusCode ?? 500;
      return handleErrorCatch(statusCode, err.message);
    }

    return handleErrorCatch(500, "Internal Server Error");
  }
});