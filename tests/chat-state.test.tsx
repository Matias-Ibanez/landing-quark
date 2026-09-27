import { beforeEach, it, expect, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatLayout } from "../src/app/chat/_components/chat-layout";

const mockApi = vi.hoisted(() => vi.fn());
let accepted: boolean | undefined;
vi.mock("../src/app/chat/_components/api", () => ({ api: mockApi }));
vi.mock("../src/app/chat/_components/chat-sidebar", () => ({ ChatSidebar: ({ onSelect }: { onSelect: (id: string) => void }) => <><button onClick={() => onSelect("a")}>Abrir A</button><button onClick={() => onSelect("b")}>Abrir B</button></> }));
vi.mock("../src/app/chat/_components/chat-header", () => ({ ChatHeader: () => null }));
vi.mock("../src/app/chat/_components/message-list", () => ({ MessageList: ({ messages }: { messages: unknown }) => <div data-testid="messages">{JSON.stringify(messages)}</div> }));
vi.mock("../src/app/chat/_components/chat-input-form", () => ({ ChatInputForm: ({ onSendMessage }: { onSendMessage: (text: string) => Promise<boolean> }) => <button onClick={() => void onSendMessage("Mi pedido").then(value => { accepted = value; })}>Enviar prueba</button> }));
vi.mock("../src/app/chat/_components/music-editor", () => ({ MusicEditor: () => null }));
vi.mock("../src/app/chat/_components/creative-brief", () => ({ CreativeBriefEditor: () => null }));
vi.mock("../src/app/chat/_components/image-gallery", () => ({ ImageGallery: () => null }));
vi.mock("../src/app/chat/_components/content-calendar", () => ({ ContentCalendar: () => null }));
vi.mock("../src/app/chat/_components/instagram-inbox", () => ({ InstagramInbox: () => null }));
vi.mock("../src/app/chat/_components/workspace-dialogs", () => ({ SettingsDialog: () => null, PlanDialog: () => null }));

function response(path: string) {
  if (path === "/projects") return [{ id: "a", name: "A", revision: 1 }, { id: "b", name: "B", revision: 1 }];
  if (path === "/settings") return { hasDeepSeekKey: true };
  if (path.endsWith("/brief")) return { brief: null, fields: [], groups: [] };
  if (path.endsWith("/messages")) return [{ id: path, role: "user", content: path.includes("/a/") ? "Mensaje A" : "Mensaje B" }];
  return [];
}
beforeEach(() => {
  sessionStorage.clear(); accepted = undefined;
  mockApi.mockReset().mockImplementation(async path => response(path));
});

it("restores the selected conversation after reloading the page", async () => {
  sessionStorage.setItem("quark:last-chat", "b");
  render(<ChatLayout />);
  await waitFor(() => expect(screen.getByTestId("messages").textContent).toContain("Mensaje B"));
});

it("does not reject an accepted submission when refreshing the sidebar fails", async () => {
  let projects = 0;
  mockApi.mockImplementation(async (path, method) => {
    if (path === "/projects" && ++projects > 1) throw new Error("Conexión interrumpida");
    if (path.endsWith("/runs") && method === "POST") return { id: "run", status: "running" };
    return response(path);
  });
  const user = userEvent.setup();
  render(<ChatLayout />);
  await user.click(screen.getByRole("button", { name: "Abrir A" }));
  await waitFor(() => expect(screen.getByTestId("messages").textContent).toContain("Mensaje A"));
  await user.click(screen.getByRole("button", { name: "Enviar prueba" }));
  await waitFor(() => expect(accepted).toBe(true));
  expect(screen.getByRole("alert").textContent).toContain("Conexión interrumpida");
  expect(mockApi.mock.calls.filter(([path, method]) => path.endsWith("/runs") && method === "POST")).toHaveLength(1);
});

it("ignores a late response from a previously selected chat", async () => {
  let finishA!: (value: unknown) => void;
  const old = new Promise(resolve => { finishA = resolve; });
  mockApi.mockImplementation(async path => path === "/projects/a/messages" ? old : response(path));
  const user = userEvent.setup();
  render(<ChatLayout />);
  await user.click(screen.getByRole("button", { name: "Abrir A" }));
  await user.click(screen.getByRole("button", { name: "Abrir B" }));
  await waitFor(() => expect(screen.getByTestId("messages").textContent).toContain("Mensaje B"));
  await act(async () => finishA(response("/projects/a/messages")));
  expect(screen.getByTestId("messages").textContent).not.toContain("Mensaje A");
});

it("routes a reply to a pending question without starting another generation", async () => {
  sessionStorage.setItem("quark:last-chat", "a");
  mockApi.mockImplementation(async (path, method) => {
    if (path === "/projects/a/brief") return { brief: { id: "piece", version: 4, status: "draft", answers: {} }, fields: [], question: "notes" };
    if (path === "/projects/a/brief/reply" && method === "POST") return { run: null };
    return response(path);
  });
  render(<ChatLayout />);
  await waitFor(() => expect(screen.getByTestId("messages").textContent).toContain("Mensaje A"));
  await userEvent.click(screen.getByRole("button", { name: "Enviar prueba" }));
  await waitFor(() => expect(accepted).toBe(true));
  expect(mockApi).toHaveBeenCalledWith("/projects/a/brief/reply", "POST", { id: "piece", version: 4, message: "Mi pedido" });
  expect(mockApi.mock.calls.filter(([path, method]) => path.endsWith("/runs") && method === "POST")).toHaveLength(0);
});
