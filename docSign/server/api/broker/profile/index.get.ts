export default defineEventHandler(async (event) => {
  try {
    const broker = event.context.broker;
    console.log(broker)

    return {
      success: true,
      broker,
    };
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
