import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    arrayUnion,
    arrayRemove,
    onSnapshot
} from "firebase/firestore";
import { db } from "./config";

// ============ CIRCLES ============

// Create a new circle
export async function createCircle(circleData, userId) {
    try {
        const circleRef = await addDoc(collection(db, "circles"), {
            ...circleData,
            ownerId: userId,
            members: circleData.members || [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { success: true, id: circleRef.id };
    } catch (error) {
        console.error("Create circle error:", error);
        return { success: false, error: error.message };
    }
}

// Get all circles for a user (owned or member of)
export async function getUserCircles(userId) {
    try {
        // Get circles owned by user
        const ownedQuery = query(
            collection(db, "circles"),
            where("ownerId", "==", userId),
            orderBy("createdAt", "desc")
        );
        const ownedSnap = await getDocs(ownedQuery);

        const circles = ownedSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
        }));

        return { success: true, data: circles };
    } catch (error) {
        console.error("Get user circles error:", error);
        return { success: false, error: error.message };
    }
}

// Get a single circle
export async function getCircle(circleId) {
    try {
        const circleRef = doc(db, "circles", circleId);
        const circleSnap = await getDoc(circleRef);

        if (circleSnap.exists()) {
            return {
                success: true,
                data: {
                    id: circleSnap.id,
                    ...circleSnap.data(),
                    createdAt: circleSnap.data().createdAt?.toDate()
                }
            };
        } else {
            return { success: false, error: "Circle not found" };
        }
    } catch (error) {
        console.error("Get circle error:", error);
        return { success: false, error: error.message };
    }
}

// Update a circle
export async function updateCircle(circleId, data) {
    try {
        const circleRef = doc(db, "circles", circleId);
        await updateDoc(circleRef, { ...data, updatedAt: serverTimestamp() });
        return { success: true };
    } catch (error) {
        console.error("Update circle error:", error);
        return { success: false, error: error.message };
    }
}

// Delete a circle
export async function deleteCircle(circleId) {
    try {
        await deleteDoc(doc(db, "circles", circleId));
        return { success: true };
    } catch (error) {
        console.error("Delete circle error:", error);
        return { success: false, error: error.message };
    }
}

// Add member to circle
export async function addCircleMember(circleId, memberEmail) {
    try {
        const circleRef = doc(db, "circles", circleId);
        await updateDoc(circleRef, {
            members: arrayUnion(memberEmail),
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error("Add circle member error:", error);
        return { success: false, error: error.message };
    }
}

// Remove member from circle
export async function removeCircleMember(circleId, memberEmail) {
    try {
        const circleRef = doc(db, "circles", circleId);
        await updateDoc(circleRef, {
            members: arrayRemove(memberEmail),
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error("Remove circle member error:", error);
        return { success: false, error: error.message };
    }
}

// ============ POSTS ============

// Create a new post
export async function createPost(postData, userId) {
    try {
        const postRef = await addDoc(collection(db, "posts"), {
            ...postData,
            authorId: userId,
            likes: [],
            comments: [],
            seenBy: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { success: true, id: postRef.id };
    } catch (error) {
        console.error("Create post error:", error);
        return { success: false, error: error.message };
    }
}

// Get posts for user's circles
export async function getPostsForCircles(circleIds, maxPosts = 25) {
    try {
        if (!circleIds || circleIds.length === 0) {
            return { success: true, data: [] };
        }

        const postsQuery = query(
            collection(db, "posts"),
            where("circleIds", "array-contains-any", circleIds),
            orderBy("createdAt", "desc"),
            limit(maxPosts) // Ethical finite feed - max 25 posts
        );

        const postsSnap = await getDocs(postsQuery);

        const posts = postsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
            expiresAt: doc.data().expiresAt?.toDate()
        }));

        return { success: true, data: posts };
    } catch (error) {
        console.error("Get posts error:", error);
        return { success: false, error: error.message };
    }
}

// Get posts by user
export async function getUserPosts(userId) {
    try {
        const postsQuery = query(
            collection(db, "posts"),
            where("authorId", "==", userId),
            orderBy("createdAt", "desc")
        );

        const postsSnap = await getDocs(postsQuery);

        const posts = postsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
        }));

        return { success: true, data: posts };
    } catch (error) {
        console.error("Get user posts error:", error);
        return { success: false, error: error.message };
    }
}

// Like/unlike a post
export async function togglePostLike(postId, userId) {
    try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
            return { success: false, error: "Post not found" };
        }

        const likes = postSnap.data().likes || [];
        const hasLiked = likes.includes(userId);

        await updateDoc(postRef, {
            likes: hasLiked ? arrayRemove(userId) : arrayUnion(userId),
            updatedAt: serverTimestamp()
        });

        return { success: true, liked: !hasLiked };
    } catch (error) {
        console.error("Toggle like error:", error);
        return { success: false, error: error.message };
    }
}

// Add comment to post
export async function addPostComment(postId, comment, userId, userName) {
    try {
        const postRef = doc(db, "posts", postId);

        const newComment = {
            id: `comment-${Date.now()}`,
            authorId: userId,
            authorName: userName,
            content: comment,
            createdAt: new Date().toISOString()
        };

        await updateDoc(postRef, {
            comments: arrayUnion(newComment),
            updatedAt: serverTimestamp()
        });

        return { success: true, comment: newComment };
    } catch (error) {
        console.error("Add comment error:", error);
        return { success: false, error: error.message };
    }
}

// Mark post as seen
export async function markPostSeen(postId, userId) {
    try {
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
            seenBy: arrayUnion(userId)
        });
        return { success: true };
    } catch (error) {
        console.error("Mark seen error:", error);
        return { success: false, error: error.message };
    }
}

// Delete a post (revoke access)
export async function deletePost(postId) {
    try {
        await deleteDoc(doc(db, "posts", postId));
        return { success: true };
    } catch (error) {
        console.error("Delete post error:", error);
        return { success: false, error: error.message };
    }
}

// ============ REAL-TIME LISTENERS ============

// Listen to circles changes
export function subscribeToCircles(userId, callback) {
    const circlesQuery = query(
        collection(db, "circles"),
        where("ownerId", "==", userId),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(circlesQuery, (snapshot) => {
        const circles = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()
        }));
        callback(circles);
    });
}

// Listen to posts changes
export function subscribeToPosts(circleIds, callback, maxPosts = 25) {
    if (!circleIds || circleIds.length === 0) {
        callback([]);
        return () => { };
    }

    const postsQuery = query(
        collection(db, "posts"),
        where("circleIds", "array-contains-any", circleIds),
        orderBy("createdAt", "desc"),
        limit(maxPosts)
    );

    return onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            expiresAt: doc.data().expiresAt?.toDate()
        }));
        callback(posts);
    });
}

// ============ USERS ============

// Get all users (demo purposes)
export async function getAllUsers() {
    try {
        // Query users, limit to 20 for demo
        const usersQuery = query(collection(db, "users"), limit(20));
        const usersSnap = await getDocs(usersQuery);

        const users = usersSnap.docs.map(doc => ({
            id: doc.id,
            name: doc.data().displayName || doc.data().email || 'User',
            email: doc.data().email || '',
            photoURL: doc.data().photoURL
        }));

        return { success: true, data: users };
    } catch (error) {
        // Don't log detailed permissions error to console to keep clean
        return { success: false, error: error.message };
    }
}
