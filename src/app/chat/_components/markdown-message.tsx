import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownMessage({ content }: { content: string }) {
  return <div className="min-w-0 space-y-3 break-words [overflow-wrap:anywhere] [&_p]:my-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-zinc-100 [&_em]:italic [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_li>p]:my-1 [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold [&_blockquote]:border-l-2 [&_blockquote]:border-violet-400 [&_blockquote]:pl-3 [&_blockquote]:text-zinc-400 [&_code]:rounded [&_code]:bg-zinc-800 [&_code]:px-1 [&_a]:text-violet-300 [&_a]:underline [&_hr]:border-zinc-700">
    <Markdown remarkPlugins={[remarkGfm]} skipHtml disallowedElements={["img"]} components={{
      a: ({ href, children }) => href ? <a href={href} target="_blank" rel="noopener noreferrer">{children}</a> : <span>{children}</span>,
      table: ({ children }) => <div className="max-w-full overflow-x-auto"><table className="w-full border-collapse text-left text-xs [&_th]:border [&_th]:border-zinc-700 [&_th]:p-2 [&_td]:border [&_td]:border-zinc-700 [&_td]:p-2">{children}</table></div>,
    }}>{content}</Markdown>
  </div>;
}
