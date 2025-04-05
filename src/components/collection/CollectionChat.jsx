import { useEffect, useState } from "react";
import axios from "axios";

const Chat = ({ collectionId = null }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `/api/chat?collectionId=${collectionId || "global"}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const newMessage = {
        text: message,
        collectionId,
        sender: "User", // Replace with real user data
      };

      await axios.post("/api/chat", newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [collectionId]);

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white shadow-xl rounded-lg">
      <h2 className="text-lg font-bold mb-2 text-emerald-600">
        {collectionId ? "Collection Chat" : "Global Chat"}
      </h2>
      <div className="h-60 overflow-y-auto p-2 bg-gray-100 rounded-md">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet.</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="chat chat-start">
              <div className="chat-bubble">{msg.text}</div>
            </div>
          ))
        )}
      </div>
      <div className="flex mt-2 gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="input input-bordered w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
