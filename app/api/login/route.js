import jwt from "jsonwebtoken";

export async function POST(req) {
  const body = await req.json();

  const { username, password } = body;

  // 🔥 simple login
  if (username === "admin" && password === "1234") {
    const token = jwt.sign(
      { role: "admin" },
      "MY_SECRET_KEY",
      { expiresIn: "1d" }
    );

    return Response.json({ success: true, token });
  }

  return Response.json({
    success: false,
    message: "Invalid credentials ❌",
  });
}
