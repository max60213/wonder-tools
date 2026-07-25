export function ToolFrame({ code, name, summary, children }: { code: string; name: string; summary: string; children: React.ReactNode }) {
  return <section className="tool-frame"><header className="tool-intro"><p className="kicker">TOOL {code}</p><h1>{name}</h1><p>{summary}</p></header>{children}</section>;
}
