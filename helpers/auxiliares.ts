
function getNextId(headers: string[], data: any[]): number | string {
  const idHeader = headers.find(h => /^id(_|$)/i.test(h))
  if (!idHeader) return ""
  const ids = data
    .map(row => Number(row[idHeader]))
    .filter(n => !isNaN(n))
  if (ids.length === 0) return 1
  return Math.max(...ids) + 1
}


function getToday() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}


export { getNextId, getToday }