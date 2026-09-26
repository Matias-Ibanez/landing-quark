import { beforeEach, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreativeBriefEditor, type BriefState } from "../src/app/chat/_components/creative-brief";

const mockApi = vi.hoisted(() => vi.fn());
vi.mock("../src/app/chat/_components/api", () => ({ api: mockApi }));
const onChange = vi.fn(async () => {});
function state(fields: BriefState["fields"], answers: Record<string, string | number> = {}, version = 1): BriefState {
  return { brief: { id: "piece", version, status: "draft", request: "Mi imagen", answers: { subject: "Café", audience: "Clientes", ...answers } }, fields, groups: ["Contenido", "Formato", "Estilo", "Texto"] };
}
beforeEach(() => {
  onChange.mockClear();
  mockApi.mockReset().mockImplementation(async (_path, _method, body) => ({ brief: { ...body, version: body.version + 1 }, run: null }));
});

it("renders an editable text input when choices are empty and the answer is absent", async () => {
  const user = userEvent.setup();
  render(<CreativeBriefEditor projectId="p" state={state([{ key: "copy_text", title: "Texto exacto", group: 3, choices: [], required: true }])} onChange={onChange} />);
  await user.type(screen.getByRole("textbox", { name: "Texto exacto" }), "Nuevo café de especialidad");
  await user.click(screen.getByRole("button", { name: "Guardar y continuar" }));
  await waitFor(() => expect(screen.getByRole("heading").textContent).toBe("Revisá tus respuestas"));
  expect(mockApi.mock.calls[0][2].answers.copy_text).toBe("Nuevo café de especialidad");
  expect(screen.getByRole("region").textContent?.toLowerCase()).not.toContain("brief");
});

it("opens exact-text input on selection and preserves its value when switching choices", async () => {
  const user = userEvent.setup();
  const fields: BriefState["fields"] = [
    { key: "copy_mode", title: "Texto de la pieza", group: 3, choices: [["auto", "Redactalo con mi pedido"], ["exact", "Usá exactamente mi texto"]] },
    { key: "copy_text", title: "Texto exacto", group: 3, choices: null, when: ["copy_mode", "exact"] },
  ];
  render(<CreativeBriefEditor projectId="p" state={state(fields, { copy_mode: "auto" })} onChange={onChange} />);
  expect(screen.queryByRole("textbox")).toBeNull();
  await user.click(screen.getByRole("radio", { name: "Usá exactamente mi texto" }));
  await user.type(screen.getByRole("textbox"), "Mi promoción");
  await user.click(screen.getByRole("radio", { name: "Redactalo con mi pedido" }));
  expect(screen.queryByRole("textbox")).toBeNull();
  await user.click(screen.getByRole("radio", { name: "Usá exactamente mi texto" }));
  expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("Mi promoción");
});

it("saves the current stage without requiring a subject from another stage", async () => {
  const user = userEvent.setup();
  render(<CreativeBriefEditor projectId="p" state={state([{ key: "notes", title: "Detalles", group: 2, choices: null }], { subject: "" })} onChange={onChange} />);
  await user.type(screen.getByRole("textbox"), "Usar los adjuntos");
  await user.click(screen.getByRole("button", { name: "Guardar y continuar" }));
  await waitFor(() => expect(mockApi).toHaveBeenCalledTimes(1));
  await user.click(screen.getByRole("button", { name: "Confirmar y crear" }));
  expect(screen.getByRole("alert").textContent).toContain("Completá el tema");
  expect(mockApi).toHaveBeenCalledTimes(1);
});

it("does not erase unsaved typing on polling and loads a newer saved version", async () => {
  const user = userEvent.setup();
  const fields: BriefState["fields"] = [{ key: "notes", title: "Detalles", group: 3, choices: null }];
  const { rerender } = render(<CreativeBriefEditor projectId="p" state={state(fields)} onChange={onChange} />);
  await user.type(screen.getByRole("textbox"), "Mi borrador");
  rerender(<CreativeBriefEditor projectId="p" state={state(fields)} onChange={onChange} />);
  expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("Mi borrador");
  rerender(<CreativeBriefEditor projectId="p" state={state(fields, { notes: "Guardado en otra pestaña" }, 2)} onChange={onChange} />);
  expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("Guardado en otra pestaña");
});

it("keeps the active group when an earlier question disappears", async () => {
  const user = userEvent.setup();
  const first = { key: "subject", title: "Tema", group: 0, choices: null };
  const last = { key: "notes", title: "Detalles", group: 3, choices: null };
  const { rerender } = render(<CreativeBriefEditor projectId="p" state={state([first, last])} onChange={onChange} />);
  await user.click(screen.getByRole("button", { name: "Guardar y continuar" }));
  await waitFor(() => expect(screen.getByRole("textbox", { name: "Detalles" })).toBeTruthy());
  rerender(<CreativeBriefEditor projectId="p" state={state([last], {}, 2)} onChange={onChange} />);
  expect(screen.getByRole("textbox", { name: "Detalles" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Confirmar y crear" })).toBeNull();
});

it("reloads saved choices from the server after a conflict", async () => {
  const user = userEvent.setup();
  const fields: BriefState["fields"] = [{ key: "notes", title: "Detalles", group: 3, choices: null }];
  mockApi.mockRejectedValueOnce(new Error("Los detalles cambiaron."));
  render(<CreativeBriefEditor projectId="p" state={state(fields)} onChange={onChange} />);
  await user.click(screen.getByRole("button", { name: "Guardar y continuar" }));
  await screen.findByRole("alert");
  mockApi.mockResolvedValueOnce(state(fields, { notes: "Respuesta recuperada" }, 3));
  await user.click(screen.getByRole("button", { name: "Recargar opciones guardadas" }));
  await waitFor(() => expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("Respuesta recuperada"));
  expect(screen.queryByRole("alert")).toBeNull();
});
