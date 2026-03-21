export async function POST(req) {
  const body = await req.json();

  if (body.password === "12345") {
    return Response.json({
      success: true,
    });
  }

  return Response.json({
    success: false,
  });
}
