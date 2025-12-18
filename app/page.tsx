"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [text, setText] = useState("");
  const [webhook, setWebhook] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e: any) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
    });
  }, []);

  const speak = () => {
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utter);
  };

  const sendOnce = async () => {
    setStatus("Sending...");
    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, webhook }),
    });
    const data = await res.json();
    setStatus(data.ok ? "Sent!" : data.error);
  };

  const installApp = async () => {
    const prompt = (window as any).deferredPrompt;
    if (prompt) {
      prompt.prompt();
      await prompt.userChoice;
      (window as any).deferredPrompt = null;
    } else {
      alert("Use Chrome menu → Install App");
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-black text-white p-6">
      <div className="w-full max-w-lg bg-neutral-900 p-6 rounded-2xl shadow">
        <h1 className="text-xl font-bold mb-4">Discord TTS App</h1>

        <label>Message</label>
        <textarea
          className="w-full p-3 rounded bg-neutral-800 mt-1 mb-3"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <label>Discord Webhook</label>
        <input
          className="w-full p-3 rounded bg-neutral-800 mt-1 mb-4"
          value={webhook}
          onChange={(e) => setWebhook(e.target.value)}
        />

        <div className="flex gap-2 flex-wrap">
          <button onClick={speak} className="bg-gray-700 px-4 py-2 rounded">
            Preview TTS
          </button>
          <button onClick={sendOnce} className="bg-indigo-600 px-4 py-2 rounded">
            Send Once
          </button>
          <button onClick={installApp} className="bg-green-600 px-4 py-2 rounded">
            Install App
          </button>
        </div>

        <p className="text-sm mt-3 opacity-80">{status}</p>
      </div>
    </main>
  );
}
