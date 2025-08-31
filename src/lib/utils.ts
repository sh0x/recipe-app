export function parseFractionToNumber(s: string): number {
  s = s.trim();
  if (/^\d+(\.\d+)?$/.test(s)) return parseFloat(s);
  const parts = s.split(' ');
  let total = 0;
  for (const p of parts) {
    if (p.includes('/')) {
      const [a,b] = p.split('/').map(Number);
      if (!isNaN(a) && !isNaN(b) && b !== 0) total += a/b;
    } else if (!isNaN(Number(p))) {
      total += Number(p);
    }
  }
  return total;
}
