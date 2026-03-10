import { useState, useEffect } from 'react';
const TIMER_DURATION = 15;
function App() {
const [gameStarted, setGameStarted] = useState(false);
const [storyTitle, setStoryTitle] = useState("Our Amazing Story");
const [storyLines, setStoryLines] = useState([]);
const [currentInput, setCurrentInput] = useState("");
const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
const [players, setPlayers] = useState(["Player 1", "Player 2", "Player 3"]);
const [isEditingTitle, setIsEditingTitle] = useState(false);
const [isEditingPlayers, setIsEditingPlayers] = useState(false);
const [playersInput, setPlayersInput] = useState("Player 1, Player 2, Player 3");
const currentPlayer = players[currentPlayerIndex];
useEffect(() => {
if (!gameStarted || timeLeft <= 0) return;
const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
return () => clearInterval(timer);
}, [timeLeft, gameStarted]);
useEffect(() => {
if (timeLeft === 0 && gameStarted) {
if (currentInput.trim()) addLine(currentInput);
nextTurn();
}
}, [timeLeft]);
const addLine = (text) => {
setStoryLines(prev => [...prev, { player: currentPlayer, text: text.trim(), id: Date.now() }]);
setCurrentInput("");
};
const nextTurn = () => {
setCurrentPlayerIndex(prev => (prev + 1) % players.length);
setTimeLeft(TIMER_DURATION);
};
const handleSubmitLine = () => {
if (!currentInput.trim()) return;
addLine(currentInput);
nextTurn();
};
const handleStartGame = () => {
  setGameStarted(true);
setTimeLeft(TIMER_DURATION);
};
const handleNewGame = () => {
setGameStarted(false);
setStoryLines([]);
setCurrentInput("");
setCurrentPlayerIndex(0);
setTimeLeft(TIMER_DURATION);
};
const handleCopyStory = () => {
const fullStory = `${storyTitle}\n\n${storyLines.map(line => `${line.player}: ${line.text}`).join("\n")}`;
navigator.clipboard.writeText(fullStory);
alert("Story copied to clipboard!");
};
const handlePlayersSubmit = () => {
const playersList = playersInput.split(',').map(p => p.trim()).filter(p => p);
if (playersList.length >= 2) {
setPlayers(playersList);
setIsEditingPlayers(false);
}
};
const percentage = (timeLeft / TIMER_DURATION) * 100;
const isLowTime = timeLeft <= 5;
return (
<div className="app">
<div className="background-effects">
<div className="orb orb-1"></div>
<div className="orb orb-2"></div>
<div className="orb orb-3"></div>
</div>
<div className="container">
<header className="header">
<h1 className="title">⚡ Swift Tales ⚡</h1>
<p className="subtitle">Create epic stories together, one line at a time!</p>
</header>
{gameStarted && (
<div className="timer-card">
<div className="timer-header">
<span className="timer-label">⏱️ TIME LEFT</span>
<span className={`timer-value ${isLowTime ? 'timer-low' : ''}`}>{timeLeft}s</span>
</div>
<div className="progress-bar">
<div className={`progress-fill ${isLowTime ? 'progress-low' : ''}`} style={{ width: `${percentage}%` }}></div>
</div>
</div>
)}
<div className="story-card">
<h2 className="story-title">⏱️ {storyTitle || "Untitled Story"}</h2>
<div className="story-content">
{storyLines.length === 0 ? (
<p className="story-empty">✨ Your amazing story will appear here...</p>
) : (
storyLines.map((line, index) => (
<div key={line.id} className="story-line">
<div className="player-avatar">{line.player[0]}</div>
<div className="line-content">
<p className="line-player">{line.player}</p>
<p className="line-text">{line.text}</p>
</div>
</div>
))
)}
</div>
</div>
{gameStarted && (
<div className="input-card">
<div className="current-player">
<div className="player-badge">{currentPlayer[0]}</div>
<div>
<p className="player-label">⏱️ CURRENT TURN</p>
<p className="player-name">{currentPlayer}</p>
</div>
</div>
<div className="input-group">
<input
type="text"
value={currentInput}
onChange={(e) => setCurrentInput(e.target.value)}
onKeyPress={(e) => e.key === 'Enter' && handleSubmitLine()}
placeholder="⏱️ Write your line of the story..."
className="story-input"
/>
<button onClick={handleSubmitLine} disabled={!currentInput.trim()} className="send-btn">
➤
</button>
</div>
</div>
)}
<div className="controls-card">
{!gameStarted && (
<>
<div className="control-group">
<label className="control-label">⏱️ STORY TITLE</label>
{isEditingTitle ? (
<div className="control-input-group">
<input
type="text"
value={storyTitle}
onChange={(e) => setStoryTitle(e.target.value)}
onKeyPress={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
className="control-input"
/>
<button onClick={() => setIsEditingTitle(false)} className="btn-secondary">Done</button>
</div>
) : (
<button onClick={() => setIsEditingTitle(true)} className="btn-outline">{storyTitle}</button>
)}
</div>
<div className="control-group">
<label className="control-label">⏱️ PLAYERS</label>
{isEditingPlayers ? (
<div className="control-input-group">
<input
type="text"
value={playersInput}
onChange={(e) => setPlayersInput(e.target.value)}
onKeyPress={(e) => e.key === 'Enter' && handlePlayersSubmit()}
className="control-input"
/>
<button onClick={handlePlayersSubmit} className="btn-secondary">Done</button>
</div>
) : (
<button onClick={() => setIsEditingPlayers(true)} className="btn-outline">{playersInput}</button>
)}
</div>
</>
)}
<div className="button-group">
{!gameStarted ? (
<button onClick={handleStartGame} className="btn-primary">⏱️ Start Game</button>
) : (
<>
<button onClick={handleNewGame} className="btn-outline">↻ New Game</button>
<button onClick={handleCopyStory} disabled={storyLines.length === 0} className="btn-secondary">⏱️ Copy Story</button>
</>
)}
</div>
</div>
</div>
</div>
);
}
export default App;