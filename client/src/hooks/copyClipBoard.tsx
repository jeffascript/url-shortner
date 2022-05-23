import { useCallback, useEffect, useState } from "react";

export enum CopyStatusEnum {
  Inactive = "inactive",
  Copied = "copied",
  Failed = "failed",
}

export type CopyStatus =
  | CopyStatusEnum.Inactive
  | CopyStatusEnum.Copied
  | CopyStatusEnum.Failed;

export const useClipboardCopyHook = (
  text: string,
  notifyTimeout = 5000
): [CopyStatus, () => void] => {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>(
    CopyStatusEnum.Inactive
  );
  const copy = useCallback(() => {
    const mdifiedText = text;
    navigator.clipboard.writeText(mdifiedText).then(
      () => setCopyStatus(CopyStatusEnum.Copied),
      () => setCopyStatus(CopyStatusEnum.Failed)
    );
  }, [text]);

  useEffect(() => {
    if (copyStatus === CopyStatusEnum.Inactive) {
      return;
    }

    const timeoutId = setTimeout(
      () => setCopyStatus(CopyStatusEnum.Inactive),
      notifyTimeout
    );

    return () => clearTimeout(timeoutId);
  }, [copyStatus, notifyTimeout]);

  return [copyStatus, copy];
};
