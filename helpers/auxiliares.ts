
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

function procesarDataSheet (values: string[][] | null | undefined ) {

  if (!values || values.length < 2) {
    const headers = values?.[0]?.map((h: string) => h.toLowerCase()) || [];
    return { headers, data: [] };
  }
  const normalizedHeaders = values[0].map((h: string) => h.toLowerCase());

  const items = values.slice(1).map((row: string[], idx: number) => {
    const obj: any = {};
    normalizedHeaders.forEach((header: string, i: number) => {
      // Asigna el valor de la celda o un string vacío si es nulo/indefinido.
      obj[header] = row[i] ?? "";
    });
    // Asigna un ID si no existe uno en los datos... no se si sacar esta parte, por ahora la dejo
    obj.id = obj.id || idx + 1;
    return obj;
  });

  const resultado = { headers: normalizedHeaders, data: items };
  return resultado
};


export { getNextId, getToday, procesarDataSheet }