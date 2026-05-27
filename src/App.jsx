import { useState } from "react";
import "./App.css";

const openingMessages = [
  { from: "system", text: "This sender is not in your contacts." },
  { from: "unknown", text: "I need to know if Eli is telling you everything." },
  { from: "maya", text: "Who is this?" },
  { from: "unknown", text: "Someone who knows what he did." },
];

const choices = [
  {
    id: "truth",
    label: "Tell me what you know.",
    result: [
      { from: "maya", text: "Tell me what you know." },
      { from: "unknown", text: "The night Zoe vanished, Eli kept something." },
      { from: "unknown", text: "Something that belonged to you." },
    ],
    clue: "Eli kept something from the night Zoe disappeared.",
  },
  {
    id: "why",
    label: "Why are you telling me this?",
    result: [
      { from: "maya", text: "Why are you telling me this?" },
      { from: "unknown", text: "Because Eli lied first." },
      { from: "unknown", text: "Ask him why your hoodie was at the lake." },
    ],
    clue: "Maya's red hoodie may be connected to Zoe's disappearance.",
  },
  {
    id: "police",
    label: "I'm calling the police.",
    result: [
      { from: "maya", text: "I'm calling the police." },
      { from: "unknown", text: "You already did." },
      { from: "unknown", text: "Ask them why your statement is missing." },
    ],
    clue: "Maya's police statement may have been removed.",
  },
];

function App() {
  const [screen, setScreen] = useState("home");
  const [messages, setMessages] = useState(openingMessages);
  const [chosen, setChosen] = useState(false);
  const [clues, setClues] = useState([]);

  function pickChoice(choice) {
    setMessages([...openingMessages, ...choice.result]);
    setChosen(true);

    if (!clues.includes(choice.clue)) {
      setClues([...clues, choice.clue]);
    }
  }

  function resetDemo() {
    setMessages(openingMessages);
    setChosen(false);
    setClues([]);
    setScreen("home");
  }

  return (
    <div className="app">
      {screen === "home" && (
        <main className="screen home">
          <p className="eyebrow">READRECEIPT</p>
          <h1>One message can change everything.</h1>
          <p className="summary">
            Maya receives a text about Eli, the last person seen with Zoe before
            she disappeared.
          </p>

          <section className="episode-card">
            <p className="episode-label">Today’s Episode</p>
            <h2>The Wrong Number</h2>
            <p>Day 1 · Mystery · 3 min read</p>
            <button onClick={() => setScreen("chat")}>Read Today’s Message</button>
          </section>

          <div className="nav">
            <button onClick={() => setScreen("clues")}>Clue Board</button>
            <button onClick={() => setScreen("episodes")}>Episodes</button>
            <button onClick={() => setScreen("pro")}>Pro</button>
          </div>
        </main>
      )}

      {screen === "chat" && (
        <main className="screen chat">
          <header className="chat-header">
            <button onClick={() => setScreen("home")}>‹</button>
            <div>
              <strong>Unknown Number</strong>
              <span>online</span>
            </div>
          </header>

          <section className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.from}`}>
                {message.text}
              </div>
            ))}

            {chosen && (
              <div className="attachment">
                <strong>Attachment received</strong>
                <p>
                  A blurry photo from the lake shows someone wearing Maya’s red
                  hoodie.
                </p>
                <button onClick={() => setScreen("pro")}>
                  Unlock Day 2 Now
                </button>
              </div>
            )}
          </section>

          {!chosen && (
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
        <main className="screen">
          <button className="back" onClick={() => setScreen("home")}>
            ‹ Back
          </button>
          <h1>Clue Board</h1>

          {clues.length === 0 ? (
            <p className="summary">No clues yet. Read today’s message first.</p>
          ) : (
            clues.map((clue, index) => (
              <div className="clue" key={clue}>
                <span>Clue {index + 1}</span>
                <p>{clue}</p>
              </div>
            ))
          )}
        </main>
      )}

      {screen === "episodes" && (
        <main className="screen">
          <button className="back" onClick={() => setScreen("home")}>
            ‹ Back
          </button>
          <h1>Episodes</h1>

          <div className="episode-list">
            <div>
              <strong>Day 1: The Wrong Number</strong>
              <span>Unlocked</span>
            </div>
            <div>
              <strong>Day 2: The Photo</strong>
              <span>Locked until tomorrow</span>
            </div>
          </div>
        </main>
      )}

      {screen === "pro" && (
        <main className="screen pro">
          <button className="back" onClick={() => setScreen("home")}>
            ‹ Back
          </button>
          <p className="eyebrow">READRECEIPT PRO</p>
          <h1>You already know you’re not waiting.</h1>
          <p className="summary">
            Unlock Day 2 early, bonus clues, alternate endings, and full-story
            binge mode.
          </p>
          <button className="gold">Unlock Everything</button>
          <button className="reset" onClick={resetDemo}>
            Reset Demo
          </button>
        </main>
      )}
    </div>
  );
}

export default App;
