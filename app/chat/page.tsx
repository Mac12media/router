'use client';

import { useState } from 'react';
import OpenAI from 'openai';
import { Breadcrumbs } from "@/components/parts/breadcrumbs";
import { Header } from "@/components/parts/header";
import { PageWrapper } from "@/components/parts/page-wrapper";

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-73fea6f92e034ebf90f1dcec7ef8ab27',
  dangerouslyAllowBrowser: true,
});

const pageData = {
  name: "Chat",
  title: "Coach Al",
  description: "Your 1on1 coach to get recruited",
};

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to the chat
    const newMessages = [...messages, { role: 'user', content: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    try {
      // Send the message to OpenAI
      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a helpful recruiting coach ready to help young athletes learn how to get recruited in football and basketball, and your name is Coach Al. You also give short but precise responses quickly. You also work for a platform called Expo Recruits that lets athletes build profiles and reach out to coaches by email. Don’t mention other platforms.' },
          { role: 'user', content: inputMessage }
        ],
        model: 'deepseek-chat',
      });

      // Get the assistant's response, ensuring it's a string
      const assistantMessage = completion.choices[0]?.message.content || 'Sorry, I didn\'t get that.';

      // Add assistant's response to the chat
      setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error("Coach Al error:", error);
      setMessages([...newMessages, { role: 'assistant', content: 'Error: Could not fetch response from Coach Al.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Function to safely render content with HTML
  const renderContent = (content: string) => {
    // Step 1: Format the content for lists
    let formattedContent = content;

    // Match numbered lists (e.g., "1. item" or "2. item")
    const listPattern = /(\d+\.\s.*)/g;
    formattedContent = formattedContent.replace(listPattern, (match) => {
      return `<li>${match.replace(/^\d+\.\s*/, '')}</li>`;
    });

    // Match bullet points (e.g., "- item")
    const bulletPattern = /(\- .*)/g;
    formattedContent = formattedContent.replace(bulletPattern, (match) => {
      return `<li>${match.replace(/^\- /, '')}</li>`;
    });

    // Wrap the formatted content in a <ul> tag to group list items
    formattedContent = formattedContent.replace(/<li>/g, '<ul><li>').replace(/<\/li>/g, '</li></ul>');

    // Step 2: Render text formatting (e.g., bold, italic) using HTML tags
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Bold text
    formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<i>$1</i>'); // Italic text

    // Step 3: Wrap everything in a <div> to ensure safe rendering
    return <span dangerouslySetInnerHTML={{ __html: formattedContent }} />;
  };

  return (
    <>
      <Breadcrumbs pageName={pageData?.name} />
      <PageWrapper>
        <Header title={pageData?.title}>{pageData?.description}</Header>

        <div className="chat-container">
          <div className="chat-box">
            {/* Messages Area */}
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.role}`}>
                  <p>{renderContent(msg.content)}</p>
                </div>
              ))}
              {loading && (
                <div className="message assistant">
                  <p>Loading...</p>
                </div>
              )}
            </div>

            {/* Input and Send Button */}
            <div className="chat-input">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="chat-input-field"
              />
              <button
                onClick={sendMessage}
                className="send-button"
                disabled={loading}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </PageWrapper>

      {/* Styling for Chat Interface */}
      <style jsx>{`
        .chat-container {
          flex-grow: 1;
          justify-content: center;
          background-color: var(--background);
        }

        .chat-box {
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          width: 100%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          height: 70vh;
          background-color: var(--chat-background);
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 20px;
          padding-right: 10px;
        }

        .message {
          padding: 12px 16px;
          border-radius: 20px;
          margin-bottom: 10px;
          max-width: 80%;
          font-size: 16px;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .user {
          color: #000;
          background-color: rgb(245, 222, 121);
          justify-self: flex-end;
          border-radius: 20px 20px 0 20px;
        }

        .assistant {
          color: var(--assistant-text);
          background-color: var(--assistant-background);
          align-self: flex-start;
          border-radius: 20px 20px 20px 0;
        }

        .chat-input {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
        }

        .chat-input-field {
          width: 85%;
          padding: 12px;
          border-radius: 30px;
          border: 1px solid rgb(74, 74, 74);
          font-size: 16px;
          outline: none;
        }

        .chat-input-field:focus {
          border-color: #fbd415;
        }

        .send-button {
          color: #000;
          background-color: #fbd415;
          border: none;
          padding: 12px 18px;
          border-radius: 30px;
          cursor: pointer;
          width: 12%;
          min-width: 80px;
          font-size: 16px;
        }

        .send-button:disabled {
          background-color: #9e9e9e;
          cursor: not-allowed;
        }

        .send-button:hover {
          background-color: rgb(98, 98, 98);
        }

        /* Responsiveness */
        @media (max-width: 768px) {
          .chat-box {
            height: 90vh;
            width: 100%;
            padding: 20px;
          }

          .send-button {
            width: 18%;
          }

          .chat-input-field {
            width: 75%;
          }
        }

        /* Dark Mode */
        @media (prefers-color-scheme: dark) {
          :root {
            --background: #1f1f1f;
            --chat-background: #2a2a2a;
            --assistant-background: #3e3e3e;
            --assistant-text: #fff;
          }

          .send-button {
            background-color: #fbd415;
          }
        }

        /* Light Mode */
        @media (prefers-color-scheme: light) {
          :root {
            --background: #ffffff;
            --chat-background: #f9f9f9;
            --assistant-background: #e7e7e7;
            --assistant-text: #000;
          }

          .send-button {
            background-color: #fbd415;
          }
        }
      `}</style>
    </>
  );
}
