import BrokerModel from "../model/broker.model";
import { verifyToken } from "../services/user/auth.service";
import { handleError } from "../utils/errorHandler";

const PUBLIC_ROUTES = [
  "/api/public",
];

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;

  const isPublicRoute =
    PUBLIC_ROUTES.some((route) => path.startsWith(route)) ||
    !path.startsWith("/api");

  if (isPublicRoute) {
    return;
  }

  const authHeader = getHeader(event, "authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return handleError(event, 401, "Token missing");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return handleError(event, 401, "Invalid token");
  }

  let decoded: { _id: string };

  try {
    decoded = verifyToken(token);
  } catch {
    return handleError(event, 401, "Invalid token");
  }

  const broker = await BrokerModel.findById(decoded._id).select("-password");

  if (!broker) {
    return handleError(event, 401, "Broker not found");
  }

  event.context.broker = broker;
});
