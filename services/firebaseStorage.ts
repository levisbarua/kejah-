import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";

export const firebaseStorage = {
    uploadImage: async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
        if (!storage) throw new Error("Firebase Storage not initialized");

        console.log("Starting upload for:", file.name);

        // Create a unique filename
        // Sanitize filename to avoid issues
        const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = ref(storage, `listings/${filename}`);

        // Use resumable upload for better debugging and progress tracking
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    if (onProgress) onProgress(progress);
                },
                (error) => {
                    console.error("Upload failed:", error);
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log("File available at", downloadURL);
                        resolve(downloadURL);
                    } catch (e) {
                        console.error("Error getting download URL:", e);
                        reject(e);
                    }
                }
            );
        });
    }
};
