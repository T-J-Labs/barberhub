import { onUnhandledRequest } from "./mocks/options";

if (
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_API_MOCKING === "enabled"
) {
  void import("./mocks/browser").then(({ worker }) => {
    return worker.start({ onUnhandledRequest });
  });
}
