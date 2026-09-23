"use client";

import { useState, useCallback } from "react";
import { ChatSidebar } from "./chat-sidebar";
import { ChatHeader } from "./chat-header";
import { MessageList } from "./message-list";
import { ChatInputForm } from "./chat-input-form";
import { ChatEmptyState } from "./chat-empty-state";
import { ImageGallery } from "./image-gallery";
import { ContentCalendar } from "./content-calendar";
import {
  DEFAULT_MODEL_ID,
  type ActiveView,
  type ChatMessage,
} from "./constants";

// ---------------------------------------------------------------------------
// ChatLayout — orchestrates sidebar + main area (header, messages, input).
// Owns top-level state: sidebar visibility, collapsed state, selected model,
// messages, and active view (chat | gallery | calendar).
// ---------------------------------------------------------------------------

/** Simple incremental id generator for demo purposes. */
let nextId = 0;
function generateId(): string {
  nextId += 1;
  return `msg-${nextId}`;
}

/** Maps each view to its header title. */
const VIEW_TITLES: Record<ActiveView, string> = {
  chat: "QUARK Chat",
  gallery: "QUARK Galería",
  calendar: "QUARK Calendario",
};

export function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL_ID);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>("chat");

  const hasMessages = messages.length > 0;

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const toggleCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleSendMessage = useCallback((text: string) => {
    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: text,
    };

    const assistantMsg: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content:
        "Gracias por tu mensaje. Estoy procesando tu solicitud. Esta es una respuesta de demostración — la integración con IA se conectará próximamente.",
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
  }, []);

  return (
    <div className="flex h-dvh overflow-hidden bg-zinc-950 text-zinc-50">
      {/* sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={closeSidebar}
        onToggleCollapse={toggleCollapse}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          onToggleSidebar={toggleSidebar}
          title={VIEW_TITLES[activeView]}
        />

        {/* ── view switcher ── */}
        {activeView === "chat" && (
          <>
            {hasMessages ? (
              /* ── active chat view ── */
              <>
                <MessageList messages={messages} />
                <ChatInputForm
                  onSendMessage={handleSendMessage}
                  selectedModelId={selectedModelId}
                  onModelChange={setSelectedModelId}
                  variant="docked"
                />
              </>
            ) : (
              /* ── empty / welcome state ── */
              <ChatEmptyState
                onSendMessage={handleSendMessage}
                selectedModelId={selectedModelId}
                onModelChange={setSelectedModelId}
              />
            )}
          </>
        )}

        {activeView === "gallery" && <ImageGallery />}

        {activeView === "calendar" && <ContentCalendar />}
      </div>
    </div>
  );
}

