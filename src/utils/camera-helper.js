class CameraHelper {
  constructor(videoElement, canvasElement) {
    this._videoElement = videoElement;
    this._canvasElement = canvasElement;
    this._stream = null;
  }
  async start() {
    try {
      this._stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this._videoElement.srcObject = this._stream;
      return true;
    } catch (error) {
      console.error("Camera access error:", error);
      return false;
    }
  }
  takePictureAsBlob() {
    if (!this._stream) return null;
    const context = this._canvasElement.getContext("2d");
    this._canvasElement.width = this._videoElement.videoWidth;
    this._canvasElement.height = this._videoElement.videoHeight;
    context.drawImage(
      this._videoElement,
      0,
      0,
      this._canvasElement.width,
      this._canvasElement.height
    );
    return new Promise((resolve) =>
      this._canvasElement.toBlob(resolve, "image/jpeg")
    );
  }
  stop() {
    if (this._stream) {
      this._stream.getTracks().forEach((track) => track.stop());
      this._stream = null;
    }
  }
}
export default CameraHelper;
