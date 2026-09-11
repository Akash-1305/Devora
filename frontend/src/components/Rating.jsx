export default function Rating({ value = 0 }) {
  return <span className="rating">★ {Number(value).toFixed(1)}</span>;
}
