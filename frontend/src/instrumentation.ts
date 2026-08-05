import { onUnhandledRequest } from "./mocks/options";

export async function register() {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.NEXT_PUBLIC_API_MOCKING === "enabled"
  ) {
    const { server } = await import("./mocks/server");

    server.listen({ onUnhandledRequest });
  }
}
