import { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  useIonToast,
  useIonLoading,
} from "@ionic/react";
import { StorageService } from "../../services/storage/StorageService";

export function StorageTestComponent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<string>("");
  const [showToast] = useIonToast();
  const [showLoading, hideLoading] = useIonLoading();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      await showToast({
        message: "Please select a file first",
        duration: 3000,
        color: "warning",
      });
      return;
    }

    try {
      await showLoading({ message: "Uploading image..." });

      const storageService = new StorageService();
      const result = await storageService.uploadImage(selectedFile);

      setUploadResult(`Success! Image uploaded to: ${result.url}`);

      await showToast({
        message: "Image uploaded successfully!",
        duration: 3000,
        color: "success",
      });
    } catch (error) {
      console.error("Upload error:", error);
      setUploadResult(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );

      await showToast({
        message: "Upload failed",
        duration: 3000,
        color: "danger",
      });
    } finally {
      await hideLoading();
    }
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Storage Test</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonItem>
          <IonLabel position="stacked">Select Image File</IonLabel>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ marginTop: "8px" }}
          />
        </IonItem>

        {selectedFile && (
          <div style={{ marginTop: "16px" }}>
            <p>
              <strong>Selected File:</strong>
            </p>
            <p>Name: {selectedFile.name}</p>
            <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <p>Type: {selectedFile.type}</p>
          </div>
        )}

        <IonButton
          expand="block"
          onClick={handleUpload}
          disabled={!selectedFile}
          style={{ marginTop: "16px" }}
        >
          Upload Image
        </IonButton>

        {uploadResult && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>Result:</strong>
            </p>
            <p style={{ wordBreak: "break-all" }}>{uploadResult}</p>
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
}
