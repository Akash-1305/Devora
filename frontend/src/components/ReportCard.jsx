import StatusBadge from "./StatusBadge";
export default function ReportCard({ r, onOpen }) {
  return (
    <div className="card report-card" onClick={() => onOpen?.(r)}>
      <div className="row between">
        <b>{r.issue_name}</b>
        <StatusBadge status={r.status} />
      </div>
      <div className="muted">{r.id}</div>
      <p>{r.location}</p>
      <div className="row between">
        <span>Ward {r.ward}</span>
        <span>
          Flag: <b>{r.flag}</b>
        </span>
      </div>
    </div>
  );
}
