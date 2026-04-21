const star = '★';

export default function StarRating({ value = 0, count = 0 }) {
  const n = Number(count) || 0;
  const rounded = Math.round(Number(value) || 0);
  const filled = Math.min(5, Math.max(0, rounded));
  return (
    <div className="d-flex align-items-center gap-1 flex-wrap">
      <span className="text-nowrap" style={{ color: 'var(--ch-star)', letterSpacing: 1, fontSize: '0.95rem' }}>
        {star.repeat(filled)}
        <span style={{ color: '#e2e8f0' }}>{star.repeat(5 - filled)}</span>
      </span>
      {n > 0 && (
        <span className="small text-secondary">
          {Number(value).toFixed(1)} ({n})
        </span>
      )}
      {n === 0 && <span className="small text-secondary">No ratings yet</span>}
    </div>
  );
}
