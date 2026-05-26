import { useMemo, useState } from "react";
import { appName, emptyStates } from "@spark/ui";
import { api } from "./api";

type Candidate = {
  id: string;
  displayName: string;
  age: number;
  city: string;
  distance: string;
  bio: string;
  interests: string[];
  photo: string;
  matchId: string;
};

type ChatMessage = {
  id: string;
  body: string;
  mine: boolean;
};

type ModerationReport = {
  id: string;
  title: string;
  status: "Open" | "Reviewed";
};

const demoCandidates: Candidate[] = [
  {
    id: "8be12b1a-5a0e-4bc7-8a38-a62cc49ed841",
    matchId: "e830f79b-4422-4666-a8c7-1cd04f3e99cf",
    displayName: "Maya",
    age: 31,
    city: "Toronto",
    distance: "4 km",
    bio: "Design lead, salsa beginner, very serious about tiny neighborhood bakeries.",
    interests: ["Design", "Dancing", "Coffee"],
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "f7a99a61-b462-4f3e-a728-67421982b4df",
    matchId: "f69c1991-b827-4591-97a0-5bfa6e3a1c4e",
    displayName: "Rowan",
    age: 29,
    city: "Hamilton",
    distance: "51 km",
    bio: "Trail runs, documentary nights, and building furniture that only sometimes wobbles.",
    interests: ["Hiking", "Film", "DIY"],
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
  }
];

export function App() {
  const [session, setSession] = useState<"signed-out" | "signed-in">("signed-out");
  const [tab, setTab] = useState<"discover" | "matches" | "chat" | "privacy" | "moderation">("discover");
  const [index, setIndex] = useState(0);
  const [matches, setMatches] = useState<Candidate[]>([]);
  const [selectedChat, setSelectedChat] = useState<Candidate>(demoCandidates[0]);
  const [chatDraft, setChatDraft] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", body: "Hey, your coffee standards sound suspiciously high.", mine: false },
    { id: "2", body: "They are peer reviewed.", mine: true }
  ]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notice, setNotice] = useState("Welcome back. Discovery is ready.");
  const [deleteRequested, setDeleteRequested] = useState(false);
  const [reports, setReports] = useState<ModerationReport[]>([
    { id: "spam", title: "Spam report", status: "Open" },
    { id: "harassment", title: "Harassment report", status: "Open" },
    { id: "impersonation", title: "Impersonation report", status: "Open" }
  ]);
  const candidate = demoCandidates[index];
  const mutualMatch = useMemo(() => matches[matches.length - 1], [matches]);
  const visibleMatches = matches.length ? matches : demoCandidates.slice(0, 1);

  async function runApiAction<T>(action: () => Promise<T>, successMessage: string, fallbackMessage: string) {
    try {
      await action();
      setNotice(successMessage);
    } catch {
      setNotice(fallbackMessage);
    }
  }

  if (session === "signed-out") {
    return (
      <main className="auth-shell">
        <section className="auth-panel">
          <div>
            <p className="eyebrow">{appName}</p>
            <h1>Meet people nearby with a calmer kind of dating app.</h1>
          </div>
          <form
            className="auth-form"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const email = String(form.get("email") ?? "");
              const password = String(form.get("password") ?? "");
              await runApiAction(
                async () => {
                  const result = await api<{ token: string }>("/auth/login", {
                    method: "POST",
                    body: JSON.stringify({ email, password })
                  });
                  localStorage.setItem("spark-token", result.token);
                },
                "Signed in with the API.",
                "Signed in with demo mode. Start the API to use live auth."
              );
              setDeleteRequested(false);
              setSession("signed-in");
            }}
          >
            <label>
              Email
              <input name="email" type="email" autoComplete="email" defaultValue="demo@spark.test" />
            </label>
            <label>
              Password
              <input name="password" type="password" autoComplete="current-password" defaultValue="StrongPass!123" />
            </label>
            <button type="submit">Sign in</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <strong className="brand">{appName}</strong>
          <p>Cross-platform dating</p>
        </div>
        <nav>
          <button className={tab === "discover" ? "active" : ""} onClick={() => setTab("discover")}>
            <span className="nav-icon" aria-hidden="true">D</span> Discover
          </button>
          <button className={tab === "matches" ? "active" : ""} onClick={() => setTab("matches")}>
            <span className="nav-icon" aria-hidden="true">M</span> Matches
          </button>
          <button className={tab === "chat" ? "active" : ""} onClick={() => setTab("chat")}>
            <span className="nav-icon" aria-hidden="true">C</span> Chat
          </button>
          <button className={tab === "privacy" ? "active" : ""} onClick={() => setTab("privacy")}>
            <span className="nav-icon" aria-hidden="true">P</span> Privacy
          </button>
          <button className={tab === "moderation" ? "active" : ""} onClick={() => setTab("moderation")}>
            <span className="nav-icon" aria-hidden="true">R</span> Moderation
          </button>
        </nav>
        <button
          className="secondary"
          onClick={() => {
            setNotice("Signed out.");
            setSession("signed-out");
          }}
        >
          <span className="nav-icon" aria-hidden="true">S</span> Sign out
        </button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <h2>{tabTitle(tab)}</h2>
            <p>
              {mutualMatch
                ? `New mutual match with ${mutualMatch.displayName}`
                : "Profile, matching, chat, and safety controls share one UI language."}
            </p>
          </div>
          <button
            className="icon-button"
            aria-label="Notifications"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setNotice(notificationsOpen ? "Notifications hidden." : "Notifications opened.");
            }}
          >
            <span aria-hidden="true">!</span>
          </button>
        </header>

        <div className="status-bar" role="status">
          {notice}
        </div>
        {notificationsOpen && (
          <section className="notification-panel" aria-label="Notifications">
            <p>{mutualMatch ? `${mutualMatch.displayName} liked you back.` : "No unread notifications."}</p>
          </section>
        )}

        {tab === "discover" && (
          <section className="discover-grid">
            {candidate ? (
              <article className="profile-card">
                <img src={candidate.photo} alt={candidate.displayName} />
                <div className="profile-copy">
                  <div>
                    <h1>
                      {candidate.displayName}, {candidate.age}
                    </h1>
                    <p>
                      {candidate.city} · {candidate.distance}
                    </p>
                  </div>
                  <p>{candidate.bio}</p>
                  <div className="chips">
                    {candidate.interests.map((interest) => (
                      <span key={interest}>{interest}</span>
                    ))}
                  </div>
                </div>
                <div className="actions">
                  <button
                    className="pass"
                    onClick={async () => {
                      await runApiAction(
                        () =>
                          api("/swipes", {
                            method: "POST",
                            body: JSON.stringify({ targetUserId: candidate.id, action: "pass" })
                          }),
                        `Passed on ${candidate.displayName}.`,
                        `Passed on ${candidate.displayName} locally.`
                      );
                      setIndex(index + 1);
                    }}
                    aria-label="Pass"
                  >
                    <span className="action-icon" aria-hidden="true">x</span>
                  </button>
                  <button
                    className="like"
                    onClick={async () => {
                      await runApiAction(
                        () =>
                          api("/swipes", {
                            method: "POST",
                            body: JSON.stringify({ targetUserId: candidate.id, action: "like" })
                          }),
                        `You liked ${candidate.displayName}.`,
                        `You liked ${candidate.displayName} locally.`
                      );
                      setMatches([...matches, candidate]);
                      setSelectedChat(candidate);
                      setIndex(index + 1);
                    }}
                    aria-label="Like"
                  >
                    <span className="action-icon" aria-hidden="true">&lt;3</span>
                  </button>
                </div>
              </article>
            ) : (
              <div className="empty">{emptyStates.discovery}</div>
            )}
          </section>
        )}

        {tab === "matches" && (
          <section className="list-view">
            {visibleMatches.map((match) => (
              <article className="match-row" key={match.id}>
                <img src={match.photo} alt="" />
                <div>
                  <h3>{match.displayName}</h3>
                  <p>{match.bio}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedChat(match);
                    setTab("chat");
                    setNotice(`Opened chat with ${match.displayName}.`);
                  }}
                >
                  Message
                </button>
              </article>
            ))}
          </section>
        )}

        {tab === "chat" && (
          <section className="chat-view">
            <h3 className="chat-heading">{selectedChat.displayName}</h3>
            <div className="messages">
              {chatMessages.map((message) => (
                <p className={`message ${message.mine ? "mine" : "theirs"}`} key={message.id}>
                  {message.body}
                </p>
              ))}
            </div>
            <form
              className="composer"
              onSubmit={async (event) => {
                event.preventDefault();
                const body = chatDraft.trim();
                if (!body) {
                  setNotice("Write a message first.");
                  return;
                }
                await runApiAction(
                  () =>
                    api("/messages", {
                      method: "POST",
                      body: JSON.stringify({ matchId: selectedChat.matchId, body })
                    }),
                  `Message sent to ${selectedChat.displayName}.`,
                  `Message saved locally for ${selectedChat.displayName}.`
                );
                setChatMessages([...chatMessages, { id: crypto.randomUUID(), body, mine: true }]);
                setChatDraft("");
              }}
            >
              <input
                placeholder={emptyStates.chat}
                value={chatDraft}
                onChange={(event) => setChatDraft(event.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </section>
        )}

        {tab === "privacy" && (
          <section className="settings-grid">
            {["Show distance", "Show online status", "Enable discovery", "Allow notifications"].map((setting) => (
              <label className="toggle-row" key={setting}>
                <span>{setting}</span>
                <input
                  type="checkbox"
                  defaultChecked
                  onChange={(event) => setNotice(`${setting} ${event.target.checked ? "enabled" : "disabled"}.`)}
                />
              </label>
            ))}
            <button
              className="danger"
              onClick={async () => {
                if (deleteRequested) {
                  await runApiAction(
                    () => api("/me", { method: "DELETE" }),
                    "Account deletion scheduled.",
                    "Account deletion scheduled locally."
                  );
                  setSession("signed-out");
                  return;
                }
                setDeleteRequested(true);
                setNotice("Tap delete again to confirm account deletion.");
              }}
            >
              {deleteRequested ? "Confirm delete" : "Delete account"}
            </button>
          </section>
        )}

        {tab === "moderation" && (
          <section className="list-view">
            {reports.map((report) => (
              <article className="moderation-row" key={report.id}>
                <div>
                  <h3>{report.title}</h3>
                  <p>
                    {report.status === "Open"
                      ? "Review evidence, hide profile, dismiss, or escalate."
                      : "Reviewed and moved out of the active queue."}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    await runApiAction(
                      () =>
                        api(`/moderation/profiles/${demoCandidates[0].id}/hide`, {
                          method: "POST"
                        }),
                      `${report.title} reviewed through the API.`,
                      `${report.title} marked reviewed locally.`
                    );
                    setReports(reports.map((item) => (item.id === report.id ? { ...item, status: "Reviewed" } : item)));
                  }}
                >
                  {report.status === "Open" ? "Review" : "Reviewed"}
                </button>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

function tabTitle(tab: string) {
  return {
    discover: "Discovery",
    matches: "Matches",
    chat: "Messages",
    privacy: "Privacy",
    moderation: "Moderation"
  }[tab];
}
