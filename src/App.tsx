import { FormEvent, useState } from "react";
import { sendChat, type ChatMessage } from "./api";
import "./App.css";

const welcomeMessage: ChatMessage = {
  role: "assistant",
  content: "你好，我是你的情感支持伙伴。愿意和我分享一下最近的心情吗？"
};

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const reply = await sendChat(nextMessages);
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "发送失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([welcomeMessage]);
    setInput("");
    setError(null);
  };

  return (
    <div className="app-page">
      <header className="app-header">
        <div>
          <p className="eyebrow">情感咨询师 · OpenAI Agent</p>
          <h1>情绪支持工作台</h1>
          <p className="subtitle">随时记录心声，获得共情与可执行建议。</p>
        </div>
        <button className="ghost-btn" onClick={handleReset} disabled={isLoading}>
          重新开始对话
        </button>
      </header>

      <section className="chat-panel">
        <div className="messages" aria-live="polite">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <p>{message.content}</p>
            </div>
          ))}
          {isLoading && <div className="typing">咨询师正在思考...</div>}
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form className="composer" onSubmit={handleSubmit}>
          <textarea
            name="message"
            placeholder="写下你的故事、困惑或此刻的心情..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isLoading}
            rows={3}
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? "生成中..." : "发送"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default App;
