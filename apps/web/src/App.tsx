import { Bell, Flag, Heart, LogOut, MessageCircle, Shield, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { appName, emptyStates } from "@spark/ui";

type Candidate = {
  id: string;
  displayName: string;
  age: number;
  city: string;
  distance: string;
  bio: string;
  interests: string[];
  photo: string;
};

const demoCandidates: Candidate[] = [
  {
    id: "1",
    displayName: "Maya",
    age: 31,
    city: "Toronto",
    distance: "4 km",
    bio: "Design lead, salsa beginner, very serious about tiny neighborhood bakeries.",
    interests: ["Design", "Dancing", "Coffee"],
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "2",
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
  const candidate = demoCandidates[index];
  const mutualMatch = useMemo(() => matches[matches.length - 1], [matches]);

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
            onSubmit={(event) => {
              event.preventDefault();
              setSession("signed-in");
            }}
          >
            <label>
              Email
              <input type="email" autoComplete="email" defaultValue="demo@spark.test" />
            </label>
            <label>
              Password
              <input type="password" autoComplete="current-password" defaultValue="StrongPass!123" />
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
            <Heart size={18} /> Discover
          </button>
          <button className={tab === "matches" ? "active" : ""} onClick={() => setTab("matches")}>
            <Shield size={18} /> Matches
          </button>
          <button className={tab === "chat" ? "active" : ""} onClick={() => setTab("chat")}>
            <MessageCircle size={18} /> Chat
          </button>
          <button className={tab === "privacy" ? "active" : ""} onClick={() => setTab("privacy")}>
            <SlidersHorizontal size={18} /> Privacy
          </button>
          <button className={tab === "moderation" ? "active" : ""} onClick={() => setTab("moderation")}>
            <Flag size={18} /> Moderation
          </button>
        </nav>
        <button className="secondary" onClick={() => setSession("signed-out")}>
          <LogOut size={18} /> Sign out
        </button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <h2>{tabTitle(tab)}</h2>
            <p>{mutualMatch ? `New mutual match with ${mutualMatch.displayName}` : "Profile, matching, chat, and safety controls share one UI language."}</p>
          </div>
          <button className="icon-button" aria-label="Notifications">
            <Bell size={20} />
          </button>
        </header>

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
                    <p>{candidate.city} · {candidate.distance}</p>
                  </div>
                  <p>{candidate.bio}</p>
                  <div className="chips">
                    {candidate.interests.map((interest) => (
                      <span key={interest}>{interest}</span>
                    ))}
                  </div>
                </div>
                <div className="actions">
                  <button className="pass" onClick={() => setIndex(index + 1)} aria-label="Pass">
                    <X size={26} />
                  </button>
                  <button
                    className="like"
                    onClick={() => {
                      setMatches([...matches, candidate]);
                      setIndex(index + 1);
                    }}
                    aria-label="Like"
                  >
                    <Heart size={28} />
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
            {(matches.length ? matches : demoCandidates.slice(0, 1)).map((match) => (
              <article className="match-row" key={match.id}>
                <img src={match.photo} alt="" />
                <div>
                  <h3>{match.displayName}</h3>
                  <p>{match.bio}</p>
                </div>
                <button>Message</button>
              </article>
            ))}
          </section>
        )}

        {tab === "chat" && (
          <section className="chat-view">
            <div className="messages">
              <p className="message theirs">Hey, your coffee standards sound suspiciously high.</p>
              <p className="message mine">They are peer reviewed.</p>
            </div>
            <form className="composer">
              <input placeholder={emptyStates.chat} />
              <button type="submit">Send</button>
            </form>
          </section>
        )}

        {tab === "privacy" && (
          <section className="settings-grid">
            {["Show distance", "Show online status", "Enable discovery", "Allow notifications"].map((setting) => (
              <label className="toggle-row" key={setting}>
                <span>{setting}</span>
                <input type="checkbox" defaultChecked />
              </label>
            ))}
            <button className="danger">Delete account</button>
          </section>
        )}

        {tab === "moderation" && (
          <section className="list-view">
            {["Spam report", "Harassment report", "Impersonation report"].map((report) => (
              <article className="moderation-row" key={report}>
                <div>
                  <h3>{report}</h3>
                  <p>Review evidence, hide profile, dismiss, or escalate.</p>
                </div>
                <button>Review</button>
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
