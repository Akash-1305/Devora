export default function StatusBadge({ status }) {
  return (
    <span
      className={"badge b-" + (status || "").toLowerCase().replaceAll(" ", "-")}
    >
      {status}
    </span>
  );
}
