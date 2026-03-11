export async function GET() {
  const demo = `
AI shrnutí dne (DEMO):
• Trhy reagují na makrodata.
• Pre-market ukazuje mírnou volatilitu.
• Tech sektor je dnes citlivý.
• Sleduj spready u růstových titulů.
`;

  return Response.json({ ok: true, summary: demo });
}
