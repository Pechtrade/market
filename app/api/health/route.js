export async function GET() {
  return Response.json(
    { ok: true, app: "Market True", status: "healthy", time: new Date().toISOString() },
    { status: 200 }
  );
}
