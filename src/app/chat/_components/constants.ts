// ---------------------------------------------------------------------------
// Chat feature constants & types
// Centralises all static data so components stay free of hardcoded strings.
// ---------------------------------------------------------------------------

/** Available AI model tiers. */
export interface AiModel {
  readonly id: string;
  readonly label: string;
}

export const AI_MODELS: readonly AiModel[] = [
  { id: "quark", label: "QUARK" },
  { id: "quark-pro", label: "QUARK-PRO" },
  { id: "quark-ultra", label: "QUARK-ULTRA" },
] as const;

/** Predefined marketing functions the user can select. */
export interface ChatFunction {
  readonly id: string;
  readonly label: string;
}

export const CHAT_FUNCTIONS: readonly ChatFunction[] = [
  { id: "content", label: "Generación de contenido" },
  { id: "strategy", label: "Estrategia de Marketing" },
  { id: "calendar", label: "Calendario Mensual" },
  { id: "promo", label: "Redacción de Promociones" },
] as const;

/** Mock sidebar conversation history. */
export const MOCK_HISTORY: readonly string[] = [
  "Campaña Día del Padre",
  "Ideas para Instagram",
  "Promo de invierno",
  "Estrategia Q3 redes",
  "Textos para newsletter",
] as const;

/** Roles a chat message can have. */
export type MessageRole = "assistant" | "user";

/** A single chat message. */
export interface ChatMessage {
  readonly id: string;
  readonly role: MessageRole;
  readonly content: string;
  readonly media?: readonly string[];
}

/** The static welcome message shown when the chat is empty. */
export const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "¡Hola! Soy QUARK, tu asistente de marketing con IA. Puedo ayudarte a crear contenido para redes, planificar estrategias y mucho más. ¿En qué puedo ayudarte hoy?",
} as const;

/** Default model selection. */
export const DEFAULT_MODEL_ID = AI_MODELS[0].id;

/** Default function selection. */
export const DEFAULT_FUNCTION_ID = CHAT_FUNCTIONS[0].id;

/** The navigable views inside /chat. */
export type ActiveView = "chat" | "gallery" | "calendar" | "instagram";
