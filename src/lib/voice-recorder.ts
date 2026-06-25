export function isCaptureSupported(): boolean {
  return !!(typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia);
}

function getPreferredMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "audio/webm";
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return "audio/webm";
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export interface CaptureHandle {
  stop: () => void;
  done: Promise<{ audioBase64: string; mimeType: string }>;
}

export function startCapture(): CaptureHandle {
  let stopRecorder: (() => void) | null = null;
  const done = new Promise<{ audioBase64: string; mimeType: string }>((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mimeType = getPreferredMimeType();
        const chunks: Blob[] = [];
        const recorder = new MediaRecorder(stream, { mimeType });
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };
        recorder.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(chunks, { type: mimeType });
          try {
            const audioBase64 = await blobToBase64(blob);
            resolve({ audioBase64, mimeType });
          } catch (err) {
            reject(err);
          }
        };
        recorder.onerror = () => {
          stream.getTracks().forEach((t) => t.stop());
          reject(new Error("Microphone recording failed"));
        };
        recorder.start();
        stopRecorder = () => {
          if (recorder.state !== "inactive") recorder.stop();
        };
      })
      .catch((err) => {
        const msg = err instanceof DOMException && err.name === "NotAllowedError"
          ? "Microphone blocked. Allow mic access in browser settings."
          : `Could not start mic: ${err?.message ?? "unknown"}`;
        reject(new Error(msg));
      });
  });
  return {
    stop: () => stopRecorder?.(),
    done,
  };
}
