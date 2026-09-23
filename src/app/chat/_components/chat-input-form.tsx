"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type FormEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import {
  PaperPlaneRight,
  Microphone,
  CaretDown,
  Lock,
  Plus,
} from "@phosphor-icons/react";
import {
  AI_MODELS,
  CHAT_FUNCTIONS,
  DEFAULT_FUNCTION_ID,
  type AiModel,
} from "./constants";

// ---------------------------------------------------------------------------
// ChatInputForm — Gemini-style unified input bar with embedded model
// selector, function selector, textarea, microphone & send button.
// ---------------------------------------------------------------------------

/** Maximum textarea rows before it starts scrolling. */
const MAX_ROWS = 5;
/** Approximate single-line height in px (used for auto-resize cap). */
const LINE_HEIGHT_PX = 24;

interface ChatInputFormProps {
  /** Called when the user submits a message. */
  onSendMessage: (text: string) => void;
  /** Currently selected model id. */
  selectedModelId: string;
  /** Callback when the user picks a different model. */
  onModelChange: (modelId: string) => void;
  /** Layout variant – 'docked' (default) anchors to bottom; 'centered' is for the empty state. */
  variant?: "docked" | "centered";
}

export function ChatInputForm({
  onSendMessage,
  selectedModelId,
  onModelChange,
  variant = "docked",
}: ChatInputFormProps) {
  const [text, setText] = useState("");
  const [selectedFn, setSelectedFn] = useState(DEFAULT_FUNCTION_ID);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [fnDropdownOpen, setFnDropdownOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const fnDropdownRef = useRef<HTMLDivElement>(null);

  const isEmpty = text.trim().length === 0;

  const selectedModel = AI_MODELS.find((m) => m.id === selectedModelId);
  const selectedFunction = CHAT_FUNCTIONS.find((f) => f.id === selectedFn);

  // ---- close dropdowns on outside click ----
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(e.target as Node)
      ) {
        setModelDropdownOpen(false);
      }
      if (
        fnDropdownRef.current &&
        !fnDropdownRef.current.contains(e.target as Node)
      ) {
        setFnDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---- auto-resize logic ----
  const handleTextChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      const el = e.target;
      el.style.height = "auto";
      const maxHeight = LINE_HEIGHT_PX * MAX_ROWS;
      el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    },
    [],
  );

  // ---- submit logic ----
  const submit = useCallback(() => {
    if (isEmpty) return;
    onSendMessage(text.trim());
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [isEmpty, text, onSendMessage]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      submit();
    },
    [submit],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
    },
    [submit],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={`shrink-0 ${
        variant === "docked"
          ? "bg-zinc-950 px-4 pb-4 pt-2 md:px-8"
          : "px-0"
      }`}
    >
      <div className="mx-auto max-w-3xl">
        {/* ── unified input container ── */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 transition-colors focus-within:border-zinc-600">
          {/* top row — textarea */}
          <div className="flex items-end gap-2 px-4 pt-3 pb-2">
            {/* function selector inline badge */}
            <div ref={fnDropdownRef} className="relative shrink-0 self-center">
              <button
                type="button"
                onClick={() => {
                  setFnDropdownOpen((prev) => !prev);
                  setModelDropdownOpen(false);
                }}
                className="flex items-center gap-1 rounded-lg px-1.5 py-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                aria-label="Seleccionar función"
              >
                <Plus size={16} weight="bold" />
              </button>

              {/* function dropdown */}
              {fnDropdownOpen && (
                <div className="absolute bottom-full left-0 z-50 mb-2 min-w-[220px] overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl shadow-black/40">
                  <div className="px-3 pt-2.5 pb-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                      Función
                    </p>
                  </div>
                  {CHAT_FUNCTIONS.map((fn) => {
                    const isActive = fn.id === selectedFn;
                    return (
                      <button
                        key={fn.id}
                        type="button"
                        onClick={() => {
                          setSelectedFn(fn.id);
                          setFnDropdownOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                          isActive
                            ? "bg-zinc-800 text-zinc-50"
                            : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                        }`}
                      >
                        {fn.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* textarea */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder={`Preguntá a ${selectedModel?.label ?? "QUARK"} — ${selectedFunction?.label ?? ""}`}
              rows={1}
              className="min-h-[32px] flex-1 resize-none bg-transparent text-sm leading-relaxed text-zinc-50 placeholder:text-zinc-600 focus-visible:outline-none"
              aria-label="Escribe tu mensaje"
            />
          </div>

          {/* bottom row — model selector + actions */}
          <div className="flex items-center justify-between border-t border-zinc-800/60 px-3 py-1.5">
            {/* model selector */}
            <div ref={modelDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setModelDropdownOpen((prev) => !prev);
                  setFnDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-mono text-xs font-medium tracking-wider text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                aria-label="Seleccionar modelo de IA"
              >
                <span className="text-zinc-300">
                  {selectedModel?.label ?? "QUARK"}
                </span>
                <CaretDown
                  size={12}
                  weight="bold"
                  className={`text-zinc-500 transition-transform duration-200 ${modelDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* model dropdown */}
              {modelDropdownOpen && (
                <div className="absolute bottom-full left-0 z-50 mb-2 min-w-[240px] overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl shadow-black/40">
                  <div className="px-3 pt-2.5 pb-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                      Modelo
                    </p>
                  </div>
                  {AI_MODELS.map((model: AiModel) => {
                    const isActive = model.id === selectedModelId;
                    const isLocked = model.id !== "quark";
                    return (
                      <button
                        key={model.id}
                        type="button"
                        disabled={isLocked}
                        onClick={() => {
                          if (!isLocked) {
                            onModelChange(model.id);
                            setModelDropdownOpen(false);
                          }
                        }}
                        title={
                          isLocked
                            ? "No disponible en la versión gratuita"
                            : undefined
                        }
                        className={`group flex w-full items-center justify-between gap-2 px-3 py-2 text-left font-mono text-sm transition-colors ${
                          isLocked
                            ? "cursor-not-allowed text-zinc-600"
                            : isActive
                              ? "bg-zinc-800 text-zinc-50"
                              : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {model.label}
                          {isLocked && (
                            <Lock
                              size={12}
                              weight="bold"
                              className="text-zinc-600"
                            />
                          )}
                        </span>
                        {isLocked && (
                          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-sans font-medium text-zinc-500">
                            PRO
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* right actions: mic + send */}
            <div className="flex items-center gap-1">
              {/* microphone */}
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                aria-label="Entrada por voz"
              >
                <Microphone size={18} />
              </button>

              {/* send */}
              <button
                type="submit"
                disabled={isEmpty}
                className="flex size-8 items-center justify-center rounded-lg bg-zinc-50 text-zinc-950 transition-all duration-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Enviar mensaje"
              >
                <PaperPlaneRight size={16} weight="fill" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
