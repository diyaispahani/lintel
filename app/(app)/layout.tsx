// Inner pages (forms, listing detail, dashboards) share a centred, readable column.

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <main className="page">{children}</main>;
}
