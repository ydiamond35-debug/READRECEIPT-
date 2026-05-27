import { useState } from "react";
import "./App.css";

const defaultName = "Maya";

function createOpeningMessages() {
  return [
    { from: "system", text: "This sender is not in your contacts." },
    { from: "unknown", text: "I need to know if Eli is telling you everything." },
    { from: "maya", text: "Who is this?" },
    { from: "unknown", text: "Someone who knows what he did." },
  ];
}

function createChoices(playerName) {
  const name = playerName || defaultName;

  return [
    {
      id: "truth",
      label: "Tell me what you know.",
      result: [
        { from: "maya", text: "Tell me what you know." },
        { from: "unknown", text: "The night Zoe vanished, Eli kept something." },
        { from: "unknown", text: `Something that belonged to ${name}.` },
      ],
      clue: `Eli kept something from the night Zoe disappeared. It may belong to ${name}.`,
    },
    {
      id: "why",
      label: "Why are you telling me this?",
      result: [
        { from: "maya", text: "Why are you telling me this?" },
        { from: "unknown", text: "Because Eli lied first." },
        { from: "unknown", text: `Ask him why ${name}'s hoodie was at the lake.` },
      ],
      clue: `${name}'s red hoodie may be connected to Zoe's disappearance.`,
    },
    {
      id: "police",
      label: "I'm calling the police.",
      result: [
        { from: "maya", text: "I'm calling the police." },
        { from: "unknown", text: "You already did." },
        { from: "unknown", text: `Ask them why ${name}'s statement is missing.` },
      ],
      clue: `${name}'s police statement may have been removed.`,
    },
  ];
}

function App() {
  const savedName = localStorage.getItem("readreceiptPlayerName") || "";
  const [playerName, setPlayerName] = useState(savedName);
  const [nameInput, setNameInput] = useState(savedName);
  const [screen, setScreen] = useState(savedName ? "home" : "name");
  const [messages, setMessages] = useState(createOpeningMessages());
  const [chosen, setChosen] = useState(false);
  const [clues, setClues] = useState([]);

  const displayName = playerName || defaultName;
  const choices = createChoices(displayName);

  function startStory() {
    const cleanName = nameInput.trim() || defaultName;
    setPlayerName(cleanName);
    localStorage.setItem("readreceiptPlayerName", cleanName);
    setScreen("home");
  }

  function pickChoice(choice) {
    setMessages([...createOpeningMessages(), ...choice.result]);
    setChosen(true);

    if (!clues.includes(choice.clue)) {
      setClues([...clues, choice.clue]);
    }
  }

  function resetDemo() {
    setMessages(createOpeningMessages());
    setChosen(false);
    setClues([]);
    setScreen("home");
  }

  function changeName() {
    localStorage.removeItem("readreceiptPlayerName");
    setPlayerName("");
    setNameInput("");
    setMessages(createOpeningMessages());
    setChosen(false);
    setClues([]);
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

          <button className="reset" onClick={() => {
            setNameInput(defaultName);
            setPlayerName(defaultName);
            localStorage.setItem("readreceiptPlayerName", defaultName);
            setScreen("home");
          }}>
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
            <button onClick={() => setScreen("chat")}>Read Today’s Message</button>
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
                  A blurry photo from the lake shows someone wearing {displayName}'s red
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
