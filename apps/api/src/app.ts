import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import multer from "multer";
import {
  createAccountSchema,
  isMutualMatch,
  loginSchema,
  messageSchema,
  profileSchema,
  reportSchema,
  swipeSchema
} from "@spark/shared";
import { config } from "./config";
import { prisma } from "./db";
import { hashPassword, requireAuth, requireModerator, signSession, verifyPassword } from "./auth";
import { validateBody } from "./validate";

const upload = multer({
  dest: config.UPLOAD_DIR,
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    cb(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype));
  }
});

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.WEB_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.post("/auth/register", validateBody(createAccountSchema), async (req, res) => {
    const { email, password, displayName, birthDate } = req.body;
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
        profile: { create: { displayName, birthDate, interests: [], photos: [] } }
      },
      select: { id: true, role: true }
    });

    res.status(201).json({ token: signSession(user), user });
  });

  app.post("/auth/login", validateBody(loginSchema), async (req, res) => {
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (!user || user.deletedAt || !(await verifyPassword(user.passwordHash, req.body.password))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    res.json({ token: signSession({ id: user.id, role: user.role }), user: { id: user.id, role: user.role } });
  });

  app.get("/me", requireAuth, async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, role: true, profile: true }
    });
    res.json({ user });
  });

  app.put("/me/profile", requireAuth, validateBody(profileSchema), async (req, res) => {
    const profile = await prisma.profile.update({
      where: { userId: req.user!.id },
      data: {
        displayName: req.body.displayName,
        bio: req.body.bio,
        interests: req.body.interests,
        photos: req.body.photos,
        latitude: req.body.location?.latitude,
        longitude: req.body.location?.longitude,
        city: req.body.location?.city,
        showDistance: req.body.privacy.showDistance,
        showOnlineStatus: req.body.privacy.showOnlineStatus,
        discoveryEnabled: req.body.privacy.discoveryEnabled,
        maximumDistanceKm: req.body.privacy.maximumDistanceKm
      }
    });
    res.json({ profile });
  });

  app.post("/me/photos", requireAuth, upload.single("photo"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Photo file is required." });
    const photoUrl = `/uploads/${req.file.filename}`;
    const profile = await prisma.profile.update({
      where: { userId: req.user!.id },
      data: { photos: { push: photoUrl } }
    });
    res.status(201).json({ photoUrl, photos: profile.photos });
  });

  app.get("/discovery", requireAuth, async (req, res) => {
    const viewer = await prisma.profile.findUnique({ where: { userId: req.user!.id } });
    if (!viewer || !viewer.discoveryEnabled) return res.json({ candidates: [] });

    const blocked = await prisma.block.findMany({
      where: { OR: [{ blockerUserId: req.user!.id }, { blockedUserId: req.user!.id }] }
    });
    const blockedIds = new Set(blocked.flatMap((item) => [item.blockerUserId, item.blockedUserId]));
    blockedIds.add(req.user!.id);

    const candidates = await prisma.profile.findMany({
      where: {
        userId: { notIn: [...blockedIds] },
        discoveryEnabled: true,
        hiddenByModeration: false,
        photos: { isEmpty: false }
      },
      take: 50,
      orderBy: { updatedAt: "desc" }
    });

    res.json({ candidates });
  });

  app.post("/swipes", requireAuth, validateBody(swipeSchema), async (req, res) => {
    const swipe = await prisma.swipe.upsert({
      where: { fromUserId_toUserId: { fromUserId: req.user!.id, toUserId: req.body.targetUserId } },
      create: { fromUserId: req.user!.id, toUserId: req.body.targetUserId, action: req.body.action },
      update: { action: req.body.action }
    });

    const swipes = await prisma.swipe.findMany({
      where: {
        OR: [
          { fromUserId: req.user!.id, toUserId: req.body.targetUserId },
          { fromUserId: req.body.targetUserId, toUserId: req.user!.id }
        ]
      }
    });
    const matched = isMutualMatch(req.user!.id, req.body.targetUserId, swipes);
    const match = matched
      ? await prisma.match.upsert({
          where: { userAId_userBId: orderedPair(req.user!.id, req.body.targetUserId) },
          create: orderedPair(req.user!.id, req.body.targetUserId),
          update: {}
        })
      : null;

    res.status(201).json({ swipe, matched, match });
  });

  app.get("/matches", requireAuth, async (req, res) => {
    const matches = await prisma.match.findMany({
      where: { OR: [{ userAId: req.user!.id }, { userBId: req.user!.id }] },
      include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
      orderBy: { createdAt: "desc" }
    });
    res.json({ matches });
  });

  app.post("/messages", requireAuth, validateBody(messageSchema), async (req, res) => {
    const match = await prisma.match.findFirst({
      where: { id: req.body.matchId, OR: [{ userAId: req.user!.id }, { userBId: req.user!.id }] }
    });
    if (!match) return res.status(404).json({ error: "Match not found." });

    const message = await prisma.message.create({
      data: { matchId: req.body.matchId, senderId: req.user!.id, body: req.body.body }
    });
    res.status(201).json({ message });
  });

  app.post("/blocks/:userId", requireAuth, async (req, res) => {
    const block = await prisma.block.upsert({
      where: { blockerUserId_blockedUserId: { blockerUserId: req.user!.id, blockedUserId: req.params.userId } },
      create: { blockerUserId: req.user!.id, blockedUserId: req.params.userId },
      update: {}
    });
    res.status(201).json({ block });
  });

  app.post("/reports", requireAuth, validateBody(reportSchema), async (req, res) => {
    const report = await prisma.report.create({
      data: { reporterUserId: req.user!.id, ...req.body }
    });
    res.status(201).json({ report });
  });

  app.delete("/me", requireAuth, async (req, res) => {
    await prisma.user.update({ where: { id: req.user!.id }, data: { deletedAt: new Date() } });
    res.status(204).send();
  });

  app.get("/moderation/reports", requireAuth, requireModerator, async (_req, res) => {
    const reports = await prisma.report.findMany({ where: { status: "OPEN" }, orderBy: { createdAt: "asc" } });
    res.json({ reports });
  });

  app.post("/moderation/profiles/:userId/hide", requireAuth, requireModerator, async (req, res) => {
    const profile = await prisma.profile.update({
      where: { userId: req.params.userId },
      data: { hiddenByModeration: true }
    });
    res.json({ profile });
  });

  return app;
}

function orderedPair(userAId: string, userBId: string) {
  const [a, b] = [userAId, userBId].sort();
  return { userAId: a, userBId: b };
}
