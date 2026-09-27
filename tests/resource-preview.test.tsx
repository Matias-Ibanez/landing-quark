import { expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ResourceCard, ResourcePreview } from "../src/app/chat/_components/resource-preview";

it("preserves SVG and PNG downloads in the click-to-open dialog", async () => {
  const close = vi.fn();
  const { rerender } = render(<ResourcePreview item={null} onClose={close} />);
  expect(screen.queryByRole("dialog")).toBeNull();
  rerender(<ResourcePreview item={{ url: "/media/exports/post.svg", title: "Mi publicación" }} onClose={close} />);
  expect(await screen.findByRole("dialog", { name: "Mi publicación" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "SVG vectorial" }).getAttribute("href")).toBe("/media/exports/post.svg");
  expect(screen.getByRole("link", { name: "PNG" }).getAttribute("href")).toBe("/media/exports/post.png");
  fireEvent.keyDown(document.activeElement!, { key: "Escape" });
  await waitFor(() => expect(close).toHaveBeenCalled());
});

it("shows PDF cover and full document link", async () => {
  render(<ResourcePreview item={{ url: "/media/assets/report.pdf", title: "Informe", document: { pages: 3, textStatus: "ocr", textTruncated: false, previewUrl: "/media/assets/report-preview.png" } }} onClose={vi.fn()} />);
  await screen.findByRole("dialog");
  expect(screen.getByRole("img", { name: "Primera página del PDF" }).getAttribute("src")).toMatch(/preview.png$/);
  expect(screen.getByRole("link", { name: "Abrir PDF completo" }).getAttribute("href")).toBe("/media/assets/report.pdf");
});

it("keeps failed thumbnails clickable without nested buttons", () => {
  const open = vi.fn();
  const { container } = render(<ResourceCard item={{ url: "/media/assets/photo.png", title: "Producto" }} onOpen={open} />);
  fireEvent.error(container.querySelector("img")!);
  expect(container.querySelector("button button")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Previsualizar Producto" }));
  expect(open).toHaveBeenCalledTimes(1);
});
