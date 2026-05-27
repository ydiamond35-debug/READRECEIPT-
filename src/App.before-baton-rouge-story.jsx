import { useState } from "react";
import "./App.css";

const defaultName = "Maya";

const openingMessages = [
  { from: "system", text: "This sender is not in your contacts." },
  { from: "unknown", text: "I need to know if Eli is telling you everything." },
  { from: "maya", text: "Who is this?" },
  { from: "unknown", text: "Someone who knows what he did." },
];

function App() {
  const savedName = localStorage.getItem("readreceiptPlayerName") || "";
  const [playerName, setPlayerName] = useState(savedName);
  const [nameInput, setNameInput] = useState(savedName);
  const [screen, setScreen] = useState(savedName ? "home" : "name");
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [introDone, setIntroDone] = useState(false);
  const [chosen, setChosen] = useState(false);
  const [clues, setClues] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachment, setShowAttachment] = useState(false);

  const displayName = playerName || defaultName;

  const choices = [
    {
      id: "truth",
      label: "Tell me what you know.",
      result: [
        { from: "maya", text: "Tell me what you know." },
        { from: "unknown", text: "The night Zoe vanished, Eli kept something." },
        { from: "unknown", text: `Something that belonged to ${displayName}.` },
      ],
      clue: `Eli kept something from the night Zoe disappeared. It may belong to ${displayName}.`,
    },
    {
      id: "why",
      label: "Why are you telling me this?",
      result: [
        { from: "maya", text: "Why are you telling me this?" },
        { from: "unknown", text: "Because Eli lied first." },
        { from: "unknown", text: `Ask him why ${displayName}'s hoodie was at the lake.` },
      ],
      clue: `${displayName}'s red hoodie may be connected to Zoe's disappearance.`,
    },
    {
      id: "police",
      label: "I'm calling the police.",
      result: [
        { from: "maya", text: "I'm calling the police." },
        { from: "unknown", text: "You already did." },
        { from: "unknown", text: `Ask them why ${displayName}'s statement is missing.` },
      ],
      clue: `${displayName}'s police statement may have been removed.`,
    },
  ];

  function playMessages(messages, doneCallback) {
    setIsTyping(false);

    let delay = 300;

    messages.forEach((message) => {
      if (message.from === "unknown") {
        setTimeout(() => setIsTyping(true), delay);
        delay += 700;
        setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages((current) => [...current, message]);
        }, delay);
        delay += 450;
      } else {
        setTimeout(() => {
          setVisibleMessages((current) => [...current, message]);
        }, delay);
        delay += 500;
      }
    });

    setTimeout(() => {
      setIsTyping(false);
      if (doneCallback) doneCallback();
    }, delay + 200);
  }

  function startStory() {
    const cleanName = nameInput.trim() || defaultName;
    setPlayerName(cleanName);
    localStorage.setItem("readreceiptPlayerName", cleanName);
    setScreen("home");
  }

  function startEpisode() {
    setVisibleMessages([]);
    setIntroDone(false);
    setChosen(false);
    setShowAttachment(false);
    setScreen("chat");

    playMessages(openingMessages, () => {
      setIntroDone(true);
    });
  }

  function pickChoice(choice) {
    setChosen(true);
    setIntroDone(false);

    if (!clues.includes(choice.clue)) {
      setClues([...clues, choice.clue]);
    }

    playMessages(choice.result, () => {
      setShowAttachment(true);
    });
  }

  function resetDemo() {
    setVisibleMessages([]);
    setIntroDone(false);
    setChosen(false);
    setShowAttachment(false);
    setClues([]);
    setScreen("home");
  }

  function changeName() {
    localStorage.removeItem("readreceiptPlayerName");
    setPlayerName("");
    setNameInput("");
    resetDemo();
    setScreen("name");
  }

  return (
    <div className="app">
      {screen === "name" && (
        <main className="screen name-screen">
          <p className="eyebrow">READRECEIPT</p>
          <h1>Who received the message?</h1>
          <p className="summary">
            Enter your name and the story will pull you into the mystery.
          </p>

          <input
            className="name-input"
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            placeholder="Your name"
            maxLength="24"
          />

          <button className="start-button" onClick={startStory}>
            Start Story
          </button>

          <button
            className="reset"
            onClick={() => {
              setNameInput(defaultName);
              setPlayerName(defaultName);
              localStorage.setItem("readreceiptPlayerName", defaultName);
              setScreen("home");
            }}
          >
            Continue as Maya
          </button>
        </main>
      )}

      {screen === "home" && (
        <main className="screen home">
          <p className="eyebrow">READRECEIPT</p>
          <h1>One message can change everything.</h1>
          <p className="summary">
            {displayName} receives a text about Eli, the last person seen with Zoe before
            she disappeared.
          </p>

          <section className="episode-card">
            <p className="episode-label">Today’s Episode</p>
            <h2>The Wrong Number</h2>
            <p>Day 1 · Mystery · 3 min read</p>
            <button onClick={startEpisode}>Read Today’s Message</button>
          </section>

          <div className="nav">
            <button onClick={() => setScreen("clues")}>Clue Board</button>
            <button onClick={() => setScreen("episodes")}>Episodes</button>
            <button onClick={() => setScreen("pro")}>Pro</button>
            <button onClick={changeName}>Change Name</button>
          </div>
        </main>
      )}

      {screen === "chat" && (
        <main className="screen chat">
          <header className="chat-header">
            <button onClick={() => setScreen("home")}>‹</button>
            <div>
              <strong>Unknown Number</strong>
              <span>{isTyping ? "typing..." : "online"}</span>
            </div>
          </header>

          <section className="messages">
            {visibleMessages.map((message, index) => (
              <div key={index} className={`message ${message.from}`}>
                {message.text}
              </div>
            ))}

            {isTyping && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            {showAttachment && (
              <div className="attachment">
                <strong>Attachment received</strong>
                <p>
                  A blurry photo from the lake shows someone wearing {displayName}'s red
                  hoodie.
                </p>
                <button onClick={() => setScreen("pro")}>
                  Unlock Day 2 Now
                </button>
              </div>
            )}
          </section>

          {introDone && !chosen && (
            <section className="choices">
              <p>How do you reply?</p>
              {choices.map((choice) => (
                <button key={choice.id} onClick={() => pickChoice(choice)}>
                  {choice.label}
                </button>
              ))}
            </section>
          )}
        </main>
      )}

      {screen === "clues" && (
        <main className="screen clue-screen">
          <button className="back" onClick={() => setScreen("home")}>
            ‹ Back
          </button>

          <p className="eyebrow">CASE FILE</p>
          <h1>Clue Board</h1>

          <div className="case-meta">
            <span>Case: The Wrong Number</span>
            <span>Evidence Found: {clues.length}/5</span>
          </div>

          {clues.length === 0 ? (
            <div className="empty-case">
              <strong>No evidence logged yet.</strong>
              <p>Read today’s message and choose a reply to unlock your first clue.</p>
            </div>
          ) : (
            clues.map((clue, index) => (
              <div className="clue" key={clue}>
                <span>Clue {String(index + 1).padStart(2, "0")}</span>
                <p>{clue}</p>
              </div>
            ))
          )}

          <div className="locked-clue">
            <span>Locked Clue</span>
            <p>Unlock Day 2 to reveal what is hidden in the photo.</p>
          </div>
        </main>
      )}

      {screen === "episodes" && (
        <main className="screen episodes-screen">
          <button className="back" onClick={() => setScreen("home")}>
            ‹ Back
          </button>

          <p className="eyebrow">EPISODES</p>
          <h1>The Last Message</h1>
          <p className="summary">
            One clue unlocks every day. Pro readers can open tomorrow’s message early.
          </p>

          <div className="episode-timeline">
            <div className="episode-row unlocked">
              <span className="episode-day">Day 1</span>
              <div>
                <strong>The Wrong Number</strong>
                <p>Unlocked · Today’s message</p>
              </div>
            </div>

            <div className="episode-row locked">
              <span className="episode-day">Day 2</span>
              <div>
                <strong>The Photo</strong>
                <p>Locked until tomorrow</p>
              </div>
            </div>

            <div className="episode-row pro-preview">
              <span className="episode-day">Pro</span>
              <div>
                <strong>Early clue preview</strong>
                <p>“Zoom into the photo. That isn’t Eli’s shadow.”</p>
              </div>
            </div>
          </div>

          <button className="gold" onClick={() => setScreen("pro")}>
            Unlock Day 2 Early
          </button>
        </main>
      )}

      {screen === "pro" && (
        <main className="screen pro pro-screen">
          <button className="back" onClick={() => setScreen("home")}>
            ‹ Back
          </button>

          <p className="eyebrow">READRECEIPT PRO</p>
          <h1>Unlock the next clue before midnight.</h1>

          <p className="summary">
            Pro is for readers who need the truth now. Open tomorrow’s message,
            reveal bonus evidence, and follow alternate endings.
          </p>

          <div className="pro-card">
            <div className="pro-preview-label">Tomorrow’s Message</div>
            <h2>Day 2: The Photo</h2>
            <p>“Zoom into the photo. That isn’t Eli’s shadow.”</p>
          </div>

          <div className="pro-perks">
            <div>
              <span>01</span>
              <p>Unlock Day 2 early</p>
            </div>
            <div>
              <span>02</span>
              <p>Reveal bonus evidence</p>
            </div>
            <div>
              <span>03</span>
              <p>Access alternate endings</p>
            </div>
            <div>
              <span>04</span>
              <p>No ads. No interruptions.</p>
            </div>
          </div>

          <button className="gold">Unlock Tomorrow’s Message</button>

          <button className="reset" onClick={resetDemo}>
            Reset Demo
          </button>
        </main>
      )}
    </div>
  );
}

export default App;
