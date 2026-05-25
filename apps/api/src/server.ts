import { createServer } from "node:http";
import { Server } from "socket.io";
import { config } from "./config";
import { createApp } from "./app";
import { prisma } from "./db";
import { verifySocketToken } from "./socketAuth";

const httpServer = createServer(createApp());
const io = new Server(httpServer, {
  cors: { origin: config.WEB_ORIGIN, credentials: true }
});

io.use(verifySocketToken);

io.on("connection", (socket) => {
  const userId = socket.data.user.id as string;
  socket.join(`user:${userId}`);

  socket.on("chat:join", async ({ matchId }) => {
    const match = await prisma.match.findFirst({
      where: { id: matchId, OR: [{ userAId: userId }, { userBId: userId }] }
    });
    if (match) socket.join(`match:${matchId}`);
  });

  socket.on("chat:send", async ({ matchId, body }) => {
    const match = await prisma.match.findFirst({
      where: { id: matchId, OR: [{ userAId: userId }, { userBId: userId }] }
    });
    if (!match || typeof body !== "string" || body.trim().length === 0) return;

    const message = await prisma.message.create({
      data: { matchId, senderId: userId, body: body.trim().slice(0, 2000) }
    });
    io.to(`match:${matchId}`).emit("chat:message", message);
  });
});

httpServer.listen(config.PORT, () => {
  console.log(`Spark API listening on http://localhost:${config.PORT}`);
});
