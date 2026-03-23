import jwt from "jsonwebtoken";

export async function POST(req) {
  const body = await req.json();

  const { username, password } = body;

  if (username === "admin" && password === "1234") {
    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET
    );

    return Response.json({
      success: true,
      token,
    });
  }

  return Response.json({
    success: false,
    message: "Invalid credentials ❌",
  });
}
