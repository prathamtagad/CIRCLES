import { storage } from './config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Uploads a profile image for the user.
 * @param {string} userId - The user's ID.
 * @param {File} file - The file to upload.
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function uploadProfileImage(userId, file) {
    try {
        // Create a reference to 'profile_images/<userId>/<timestamp>_<filename>'
        const fileExtension = file.name.split('.').pop();
        const fileName = `${Date.now()}_profile.${fileExtension}`;
        const path = `profile_images/${userId}/${fileName}`;
        const storageRef = ref(storage, path);

        // Upload
        const snapshot = await uploadBytes(storageRef, file);

        // Get URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return { success: true, url: downloadURL };
    } catch (error) {
        console.error("Error uploading image:", error);
        return { success: false, error: error.message };
    }
}
