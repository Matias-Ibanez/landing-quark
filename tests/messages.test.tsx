import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MarkdownMessage } from "../src/app/chat/_components/markdown-message";
import { MessageList } from "../src/app/chat/_components/message-list";
import { MediaImage } from "../src/app/chat/_components/media-image";

describe("message rendering", () => {
  it("renders emphasis, lists, headings, links and tables", () => {
    const { container } = render(<MarkdownMessage content={'## Plan\n\n**Tu marca** y *tu público*.\n\n- Una idea\n- Otra idea\n\n[Instagram](https://instagram.com)\n\n| Día | Idea |\n| --- | --- |\n| Lunes | Producto |'} />);
    expect(container.querySelector("strong")?.textContent).toBe("Tu marca");
    expect(container.querySelector("em")?.textContent).toBe("tu público");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Plan" })).toBeTruthy();
    expect(screen.getByRole("link").getAttribute("rel")).toContain("noopener");
    expect(screen.getByRole("table")).toBeTruthy();
  });
  it("does not execute raw HTML or unsafe URLs and does not embed remote images", () => {
    const { container } = render(<MarkdownMessage content={'<script>alert(1)</script>\n\n[Mal](javascript:alert(1))\n\n![Remota](https://example.com/track.png)\n\n<img src="x" onerror="alert(1)" />'} />);
    expect(container.querySelector("script,img")).toBeNull();
    expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
  });
  it("keeps the user's uploaded image on its message", () => {
    render(<MessageList messages={[{ id: "1", role: "user", content: "Mi producto", media: ["/media/assets/producto.png"] }]} />);
    expect(screen.getByRole("img").getAttribute("src")).toBe("/media/assets/producto.png");
    expect(screen.getByRole("link", { name: "Abrir adjunto" })).toBeTruthy();
  });
  it("shows older valid export names and preserves PNG and SVG downloads without duplicating images", () => {
    render(<MessageList messages={[{ id: "1", role: "assistant", content: "**Lista**", media: ["/media/exports/design-final.svg", "/media/exports/design-final.svg"] }]} />);
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.getByRole("img").getAttribute("src")).toBe("/media/exports/design-final.png");
    expect(screen.getByRole("link", { name: "Descargar SVG vectorial" }).getAttribute("href")).toMatch(/\.svg$/);
    expect(screen.getByRole("link", { name: "Descargar PNG" }).getAttribute("href")).toMatch(/\.png$/);
  });
  it("falls back to SVG and offers a retry when both previews fail", () => {
    render(<MediaImage src="/media/exports/post.svg" previewVector alt="Publicación" />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByRole("img").getAttribute("src")).toMatch(/\.svg$/);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByRole("alert")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(screen.getByRole("img").getAttribute("src")).toMatch(/\.png$/);
  });
});
