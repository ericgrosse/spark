import jwt from "jsonwebtoken";
import type { Socket } from "socket.io";
import { config } from "./config";

export function verifySocketToken(socket: Socket, next: (err?: Error) => void) {
  const token = socket.handshake.auth.token;
  if (typeof token !== "string") return next(new Error("Authentication required."));

  try {
    socket.data.user = jwt.verify(token, config.JWT_SECRET, { issuer: "spark-api" });
    next();
  } catch {
    next(new Error("Invalid session."));
  }
}
