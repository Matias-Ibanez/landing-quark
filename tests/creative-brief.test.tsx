import { beforeEach, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreativeBriefEditor, type BriefState } from "../src/app/chat/_components/creative-brief";

const mockApi = vi.hoisted(() => vi.fn());
vi.mock("../src/app/chat/_components/api", () => ({ api: mockApi }));
const onChange = vi.fn(async () => {});
const text = { key: "copy_text", title: "Texto exacto", group: 3, choices: [], required: true };
const aspect = { key: "aspect", title: "Formato", group: 1, choices: [["square", "Cuadrado"], ["story", "Vertical"]] } as BriefState["fields"][number];
function state(fields: BriefState["fields"], answers: Record<string, string | number> = {}, version = 1, question: string | null = fields[0]?.key ?? null): BriefState {
  return { brief: { id: "piece", version, status: "draft", request: "Mi imagen", answers: { subject: "Café", audience: "Clientes", ...answers } }, fields, question, groups: [] };
}
beforeEach(() => {
  onChange.mockClear();
  mockApi.mockReset().mockImplementation(async (_path, _method, body) => ({ brief: { ...body, version: body.version + 1 }, run: null }));
});

it("shows an editable exact-text input and persists the individual response", async () => {
  const user = userEvent.setup();
  render(<CreativeBriefEditor projectId="p" state={state([text])} onChange={onChange} />);
  await user.type(screen.getByRole("textbox", { name: "Texto exacto" }), "Nuevo café de especialidad");
  await user.click(screen.getByRole("button", { name: "Responder" }));
  await waitFor(() => expect(onChange).toHaveBeenCalled());
  expect(mockApi.mock.calls[0][2]).toMatchObject({ field: "copy_text", answers: { copy_text: "Nuevo café de especialidad" } });
  expect(screen.getByRole("region").textContent?.toLowerCase()).not.toContain("brief");
});

it("shows only the current question and saves a choice immediately", async () => {
  const { rerender } = render(<CreativeBriefEditor projectId="p" state={state([aspect, text])} onChange={onChange} />);
  expect(screen.queryByRole("textbox")).toBeNull();
  await userEvent.click(screen.getByRole("button", { name: "Vertical" }));
  await waitFor(() => expect(mockApi).toHaveBeenCalledTimes(1));
  expect(mockApi.mock.calls[0][2]).toMatchObject({ action: "save", field: "aspect", answers: { aspect: "story" } });
  rerender(<CreativeBriefEditor projectId="p" state={state([aspect, text], { aspect: "story" }, 2, "copy_text")} onChange={onChange} />);
  expect(screen.getByRole("textbox", { name: "Texto exacto" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Vertical" })).toBeNull();
});

it("does not erase unsaved typing on polling and loads a newer saved version", async () => {
  const fields = [{ key: "notes", title: "Detalles", group: 3, choices: null }];
  const { rerender } = render(<CreativeBriefEditor projectId="p" state={state(fields)} onChange={onChange} />);
  await userEvent.type(screen.getByRole("textbox"), "Mi borrador");
  rerender(<CreativeBriefEditor projectId="p" state={state(fields)} onChange={onChange} />);
  expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("Mi borrador");
  rerender(<CreativeBriefEditor projectId="p" state={state(fields, { notes: "Guardado en otra pestaña" }, 2)} onChange={onChange} />);
  expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("Guardado en otra pestaña");
});

it("offers a review and individual editing before confirmation", async () => {
  render(<CreativeBriefEditor projectId="p" state={state([aspect, text], { aspect: "square", copy_text: "Mi promoción" }, 3, null)} onChange={onChange} />);
  expect(screen.queryByRole("textbox")).toBeNull();
  await userEvent.click(screen.getByText("Revisar mis respuestas"));
  expect(screen.getByText("Mi promoción")).toBeTruthy();
  await userEvent.click(screen.getByRole("button", { name: "Editar Texto exacto" }));
  expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("Mi promoción");
  expect(screen.queryByRole("button", { name: "Crear mi pieza" })).toBeNull();
});

it("confirms only when the server reports no pending question", async () => {
  render(<CreativeBriefEditor projectId="p" state={state([aspect], { aspect: "square" }, 2, null)} onChange={onChange} />);
  await userEvent.click(screen.getByRole("button", { name: "Crear mi pieza" }));
  await waitFor(() => expect(mockApi).toHaveBeenCalledTimes(1));
  expect(mockApi.mock.calls[0][2].action).toBe("confirm");
});

it("keeps the answer after rejection and refreshes through the parent", async () => {
  mockApi.mockRejectedValueOnce(new Error("Los detalles cambiaron."));
  render(<CreativeBriefEditor projectId="p" state={state([text])} onChange={onChange} />);
  await userEvent.type(screen.getByRole("textbox"), "Mi promoción");
  await userEvent.click(screen.getByRole("button", { name: "Responder" }));
  await screen.findByRole("alert");
  expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("Mi promoción");
  await userEvent.click(screen.getByRole("button", { name: "Actualizar conversación" }));
  expect(onChange).toHaveBeenCalledWith(null);
});
