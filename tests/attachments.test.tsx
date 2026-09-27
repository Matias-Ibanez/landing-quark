import { beforeEach, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatInputForm } from "../src/app/chat/_components/chat-input-form";
import { api } from "../src/app/chat/_components/api";

vi.mock("../src/app/chat/_components/api", () => ({ api: vi.fn() }));
const asset = { id: "photo", name: "remera.png", filename: "photo.png", kind: "image" };
beforeEach(() => vi.mocked(api).mockReset());

it("sends an image without requiring text and clears the composer after acceptance", async () => {
  const send = vi.fn().mockResolvedValue(true);
  vi.mocked(api).mockResolvedValue(asset);
  const user = userEvent.setup();
  render(<ChatInputForm onSendMessage={send} />);
  await user.upload(screen.getByLabelText("Archivos para adjuntar"), new File(["photo"], "remera.png", { type: "image/png" }));
  expect((screen.getByRole("button", { name: "Enviar mensaje" }) as HTMLButtonElement).disabled).toBe(false);
  await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));
  expect(send).toHaveBeenCalledWith(expect.stringContaining("recursos"), "content", ["photo"], [asset]);
  expect(screen.queryByText("remera.png")).toBeNull();
});
it("retains text and the attachment when the request is rejected", async () => {
  vi.mocked(api).mockResolvedValue(asset);
  const user = userEvent.setup();
  render(<ChatInputForm onSendMessage={vi.fn().mockResolvedValue(false)} />);
  await user.upload(screen.getByLabelText("Archivos para adjuntar"), new File(["photo"], "remera.png", { type: "image/png" }));
  await user.type(screen.getByRole("textbox"), "Mi remera");
  await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));
  expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("Mi remera");
  expect(screen.getByText("remera.png")).toBeTruthy();
});
it("continues with valid files after one file fails", async () => {
  vi.mocked(api).mockRejectedValueOnce(new Error("Imagen inválida")).mockResolvedValueOnce(asset);
  const user = userEvent.setup();
  render(<ChatInputForm onSendMessage={vi.fn()} />);
  await user.upload(screen.getByLabelText("Archivos para adjuntar"), [new File(["bad"], "bad.png", { type: "image/png" }), new File(["ok"], "remera.png", { type: "image/png" })]);
  expect(screen.getByRole("alert").textContent).toContain("bad.png");
  expect(screen.getByText("remera.png")).toBeTruthy();
});
it("prevents duplicate submissions while awaiting acceptance", async () => {
  const send = vi.fn(() => new Promise<boolean>(() => {}));
  const user = userEvent.setup();
  render(<ChatInputForm onSendMessage={send} />);
  await user.type(screen.getByRole("textbox"), "Hola");
  await user.dblClick(screen.getByRole("button", { name: "Enviar mensaje" }));
  expect(send).toHaveBeenCalledTimes(1);
});
it("checks size before uploading oversized files", async () => {
  const user = userEvent.setup();
  const file = new File(["x"], "grande.png", { type: "image/png" });
  Object.defineProperty(file, "size", { value: 31 * 1024 * 1024 });
  render(<ChatInputForm onSendMessage={vi.fn()} />);
  await user.upload(screen.getByLabelText("Archivos para adjuntar"), file);
  expect(api).not.toHaveBeenCalled();
  expect(screen.getByRole("alert").textContent).toContain("30 MB");
});

it("pastes images and drops PDFs without a marketing function selector", async () => {
  const doc = { id: "pdf", filename: "pdf.pdf", name: "campaña.pdf", kind: "document", document: { pages: 2, textStatus: "ready", textTruncated: false, previewUrl: "/media/assets/pdf-preview.png" } };
  vi.mocked(api).mockResolvedValueOnce(asset).mockResolvedValueOnce(doc);
  const send = vi.fn().mockResolvedValue(true);
  const { container } = render(<ChatInputForm onSendMessage={send} />);
  fireEvent.paste(screen.getByRole("textbox"), { clipboardData: { files: [new File(["img"], "foto.png", { type: "image/png" })] } });
  await screen.findByText("remera.png");
  await waitFor(() => expect(screen.queryByText("Preparando adjuntos…")).toBeNull());
  fireEvent.drop(container.querySelector("form")!, { dataTransfer: { files: [new File(["%PDF"], "campaña.pdf", { type: "application/pdf" })], types: ["Files"] } });
  await screen.findByText("campaña.pdf");
  expect(screen.queryByRole("combobox")).toBeNull();
  await userEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
  expect(send).toHaveBeenCalledWith(expect.any(String), "content", ["photo", "pdf"], [asset, doc]);
});
