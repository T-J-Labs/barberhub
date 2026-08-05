import {
  isCommonAssetRequest,
  type UnhandledRequestCallback,
} from "msw";

export const onUnhandledRequest: UnhandledRequestCallback = (
  request,
  print,
) => {
  if (!isCommonAssetRequest(request)) {
    print.warning();
  }
};
