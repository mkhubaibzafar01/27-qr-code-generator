const qrInput = document.querySelector("#qrInput");
const generateBtn = document.querySelector("#generateBtn");
const downloadBtn = document.querySelector("#downloadBtn");
const qrImage = document.querySelector("#qrImage");
const result = document.querySelector("#result");
const message = document.querySelector("#message");

let currentObjectUrl = null;

function generateQRCode() {
  const text = qrInput.value.trim();

  if (!text) {
    message.textContent = "Please enter some text or a URL first.";
    result.hidden = true;
    return;
  }

  generateBtn.disabled = true;
  result.hidden = true;
  message.textContent = "Generating your QR code...";

  const apiUrl =
    "https://api.qrserver.com/v1/create-qr-code/" +
    "?size=300x300&format=png&data=" +
    encodeURIComponent(text);

  const image = new Image();

  image.onload = () => {
    qrImage.src = image.src;
    result.hidden = false;
    message.textContent = "QR code generated successfully!";
    generateBtn.disabled = false;
  };

  image.onerror = () => {
    message.textContent =
      "Could not generate the QR code. Check your internet and try again.";
    generateBtn.disabled = false;
  };

  image.src = apiUrl;
}

async function downloadQRCode() {
  if (!qrImage.src) return;

  try {
    downloadBtn.disabled = true;
    message.textContent = "Preparing your download...";

    const response = await fetch(qrImage.src);

    if (!response.ok) {
      throw new Error("Download failed");
    }

    const blob = await response.blob();

    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
    }

    currentObjectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = currentObjectUrl;
    link.download = "my-qr-code.png";

    document.body.appendChild(link);
    link.click();
    link.remove();

    message.textContent = "Your QR code download has started!";
  } catch {
    message.textContent =
      "Download blocked by the browser. Open the QR image in a new tab and save it.";
    window.open(qrImage.src, "_blank", "noopener,noreferrer");
  } finally {
    downloadBtn.disabled = false;
  }
}

generateBtn.addEventListener("click", generateQRCode);
downloadBtn.addEventListener("click", downloadQRCode);

qrInput.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "Enter") {
    generateQRCode();
  }
});