import { beforeEach, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../src/app/login/login-form";
import { api } from "../src/app/chat/_components/api";
import ChatLayout from "../src/app/chat/layout";

const mocks = vi.hoisted(() => ({ session:vi.fn(), csrf:vi.fn(), cookies:vi.fn(), redirect:vi.fn() }));
vi.mock("@/lib/auth-client", () => ({ getAuthSession:mocks.session, csrfToken:mocks.csrf, clearAuthSession:vi.fn() }));
vi.mock("next/headers", () => ({ cookies:mocks.cookies }));
vi.mock("next/navigation", () => ({ redirect:mocks.redirect }));

beforeEach(() => {
  mocks.session.mockReset().mockResolvedValue({authenticated:false,configured:true,csrfToken:"fresh-nonce"});
  mocks.csrf.mockReset().mockResolvedValue("session-csrf");
  mocks.cookies.mockReset();
  mocks.redirect.mockReset().mockImplementation((path:string) => { throw new Error("redirect:"+path); });
  vi.stubGlobal("fetch", vi.fn());
});

it("keeps login disabled when admin has not been configured", async () => {
  mocks.session.mockResolvedValue({authenticated:false,configured:false});
  render(<LoginForm />);
  await screen.findByRole("status");
  expect((screen.getByRole("button",{name:"Ingresar"}) as HTMLButtonElement).disabled).toBe(true);
});

it("refreshes login CSRF, sends credentials once, and clears a rejected password", async () => {
  const user = userEvent.setup();
  vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({detail:"Usuario o contraseña incorrectos"}),{status:401}));
  render(<LoginForm />);
  const button = await screen.findByRole("button",{name:"Ingresar"});
  await waitFor(() => expect((button as HTMLButtonElement).disabled).toBe(false));
  await user.type(screen.getByLabelText("Contraseña"),"only-test-password");
  await user.click(button);
  expect((await screen.findByRole("alert")).textContent).toContain("Usuario o contraseña incorrectos");
  expect(fetch).toHaveBeenCalledOnce();
  const [url,options] = vi.mocked(fetch).mock.calls[0];
  expect(url).toBe("/api/auth/login");
  expect(options?.headers).toEqual({"Content-Type":"application/json","X-Quark-CSRF":"fresh-nonce"});
  expect(JSON.parse(options?.body as string)).toEqual({username:"admin",password:"only-test-password"});
  expect((screen.getByLabelText("Contraseña") as HTMLInputElement).value).toBe("");
  expect(mocks.session).toHaveBeenCalledTimes(2);
});

it("adds CSRF to uploads without overriding the multipart boundary", async () => {
  vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({id:"upload"}),{status:201}));
  const body = new FormData(); body.append("file",new File(["sample"],"sample.txt"));
  await api("/assets","POST",body);
  const options = vi.mocked(fetch).mock.calls[0][1];
  expect((options?.headers as Headers).get("X-Quark-CSRF")).toBe("session-csrf");
  expect((options?.headers as Headers).has("Content-Type")).toBe(false);
  expect(options?.credentials).toBe("same-origin");
});

it("reads data with the browser cookie without fetching a CSRF token", async () => {
  vi.mocked(fetch).mockResolvedValue(new Response("[]"));
  await api("/projects");
  expect(mocks.csrf).not.toHaveBeenCalled();
  expect(vi.mocked(fetch).mock.calls[0][1]?.credentials).toBe("same-origin");
});

it("redirects an anonymous chat before loading private content", async () => {
  mocks.cookies.mockResolvedValue({get:() => undefined});
  await expect(ChatLayout({children:"private"})).rejects.toThrow("redirect:/login");
  expect(fetch).not.toHaveBeenCalled();
});

it("validates a present cookie with the backend instead of trusting its presence", async () => {
  mocks.cookies.mockResolvedValue({get:() => ({name:"quark-session",value:"invalid"})});
  vi.mocked(fetch).mockResolvedValue(new Response("{}",{status:401}));
  await expect(ChatLayout({children:"private"})).rejects.toThrow("redirect:/login");
  expect(vi.mocked(fetch).mock.calls[0][1]?.headers).toEqual({Cookie:"quark-session=invalid"});
});

it("keeps chat closed when the backend is unavailable", async () => {
  mocks.cookies.mockResolvedValue({get:() => ({name:"quark-session",value:"opaque"})});
  vi.mocked(fetch).mockRejectedValue(new Error("offline"));
  await expect(ChatLayout({children:"private"})).rejects.toThrow("redirect:/login");
});

it("renders the chat only after server validation", async () => {
  mocks.cookies.mockResolvedValue({get:() => ({name:"quark-session",value:"opaque"})});
  vi.mocked(fetch).mockResolvedValue(new Response('{"authenticated":true}'));
  const result = await ChatLayout({children:"authorized"});
  render(result); expect(screen.getByText("authorized")).toBeTruthy();
});
