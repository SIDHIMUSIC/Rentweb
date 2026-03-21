export async function POST(req) {
  const body = await req.json();

  if (body.password === process.env.ADMIN_PASSWORD) {
    return Response.json({
      success: true,
      isAdmin: true,
    });
  }

  return Response.json({
    success: false,
  });
}
