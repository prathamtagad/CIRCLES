import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    onAuthChange,
    signInWithGoogle,
    signOut,
    updateUserProfile,
    getUserProfile
} from '../firebase/auth';
import {
    createCircle as fbCreateCircle,
    getUserCircles,
    updateCircle,
    deleteCircle,
    addCircleMember,
    createPost as fbCreatePost,
    getPostsForCircles,
    getUserPosts,
    togglePostLike,
    addPostComment,
    markPostSeen,
    deletePost,
    subscribeToCircles,
    subscribeToPosts,
    getAllUsers
} from '../firebase/firestore';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    // Auth state
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // App state
    const [circles, setCircles] = useState([]);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]); // Re-added users state
    const [loading, setLoading] = useState(false);
    const [isOnboarded, setIsOnboarded] = useState(false);
    const [liteMode, setLiteMode] = useState(false);
    const [darkMode] = useState(true);
    const [activeCircle, setActiveCircle] = useState('all');
    const [toast, setToast] = useState(null);
    const [bytesLoaded, setBytesLoaded] = useState(0);
    const [bytesSaved, setBytesSaved] = useState(0);

    // Initialize Auth
    useEffect(() => {
        const unsubscribe = onAuthChange(async (user) => {
            setCurrentUser(user);

            if (user) {
                setAuthLoading(true); // Ensure loading while profile fetches
                // Fetch user profile
                const result = await getUserProfile(user.uid);
                if (result.success) {
                    setUserProfile(result.data);
                    setIsOnboarded(result.data.isOnboarded || false);
                    setLiteMode(result.data.settings?.liteMode || false);
                } else {
                    // Graceful fallback
                    setIsOnboarded(false);
                }

                // Fetch all users for selection in Create Circle (Best effort)
                const usersResult = await getAllUsers();
                if (usersResult.success) {
                    setUsers(usersResult.data);
                }
            } else {
                setUserProfile(null);
                setIsOnboarded(false);
                setCircles([]);
                setPosts([]);
                setUsers([]);
            }

            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Subscribe to circles when user is logged in
    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = subscribeToCircles(currentUser.uid, (newCircles) => {
            setCircles(newCircles);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // Subscribe to posts when circles change
    useEffect(() => {
        if (!currentUser || circles.length === 0) {
            setPosts([]);
            return;
        }

        const circleIds = circles.map(c => c.id);
        const unsubscribe = subscribeToPosts(circleIds, (newPosts) => {
            setPosts(newPosts);
        }, 25); // Ethical finite feed - max 25 posts

        return () => unsubscribe();
    }, [currentUser, circles]);

    // Calculate privacy stats
    const privacyStats = {
        totalPosts: posts.filter(p => p.authorId === currentUser?.uid).length,
        totalViews: posts.filter(p => p.authorId === currentUser?.uid).reduce((acc, p) => acc + (p.seenBy?.length || 0), 0),
        encryptedPosts: posts.filter(p => {
            const postCircles = circles.filter(c => p.circleIds?.includes(c.id));
            return postCircles.some(c => c.trustLevel === 'inner');
        }).length,
    };

    // Auth functions
    const handleSignIn = async () => {
        setLoading(true);
        const result = await signInWithGoogle();
        setLoading(false);

        if (result.success) {
            showToast('Welcome to Circles!', 'success');
        } else {
            showToast(`Sign in failed: ${result.error}`, 'error');
        }
    };

    const handleSignOut = async () => {
        const result = await signOut();
        if (result.success) {
            showToast('Signed out successfully', 'success');
        }
        return result;
    };

    // Complete onboarding
    const completeOnboarding = async () => {
        if (!currentUser) return;

        await updateUserProfile(currentUser.uid, { isOnboarded: true });
        setIsOnboarded(true);
    };

    // Get user info by ID (for display)
    const getUserById = (id) => {
        if (id === currentUser?.uid) {
            return {
                id: currentUser.uid,
                name: userProfile?.displayName || currentUser.displayName || 'You',
                email: currentUser.email,
                photoURL: userProfile?.photoURL || currentUser.photoURL
            };
        }
        // Try to find in loaded users
        const foundUser = users.find(u => u.id === id);
        if (foundUser) return foundUser;

        return { id, name: 'User', email: '' };
    };

    // Get circle by ID
    const getCircleById = (id) => circles.find(c => c.id === id);

    // Create a new circle
    const createCircle = async (circleData) => {
        if (!currentUser) return null;

        setLoading(true);
        const result = await fbCreateCircle(circleData, currentUser.uid);
        setLoading(false);

        if (result.success) {
            showToast(`Circle "${circleData.name}" created!`, 'success');
            return { id: result.id, ...circleData };
        } else {
            showToast(`Failed: ${result.error}`, 'error');
            return null;
        }
    };

    // Create a new post
    const createPost = async (postData) => {
        if (!currentUser) return null;

        setLoading(true);
        const result = await fbCreatePost(postData, currentUser.uid);
        setLoading(false);

        if (result.success) {
            showToast('Post shared with your circles!', 'success');
            return { id: result.id, ...postData };
        } else {
            showToast('Failed to create post', 'error');
            return null;
        }
    };

    // Like a post
    const likePost = async (postId) => {
        if (!currentUser) return;

        const result = await togglePostLike(postId, currentUser.uid);
        // UI updates automatically via subscription
    };

    // Add comment to post
    const addComment = async (postId, content) => {
        if (!currentUser) return;

        const userName = userProfile?.displayName || currentUser.displayName || 'User';
        await addPostComment(postId, content, currentUser.uid, userName);
    };

    // Revoke post visibility (delete)
    const revokePostAccess = async (postId) => {
        const result = await deletePost(postId);
        if (result.success) {
            showToast('Post access revoked. Content removed.', 'success');
        }
    };

    // Show toast notification
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Toggle lite mode
    const toggleLiteMode = async () => {
        const newMode = !liteMode;
        setLiteMode(newMode);

        if (currentUser) {
            await updateUserProfile(currentUser.uid, {
                settings: { liteMode: newMode }
            });
        }

        if (newMode) {
            setBytesSaved(prev => prev + 405);
            showToast('Lite Mode enabled — Saving bandwidth!', 'success');
        } else {
            showToast('Full experience restored', 'success');
        }
    };

    // Get filtered posts based on active circle
    const getFilteredPosts = () => {
        if (activeCircle === 'all') {
            return posts.slice(0, 25);
        }
        return posts.filter(p => p.circleIds?.includes(activeCircle)).slice(0, 25);
    };

    // Get members count for circles
    const getCircleMembersCount = (circleIds) => {
        const uniqueMembers = new Set();
        circleIds.forEach(cId => {
            const circle = circles.find(c => c.id === cId);
            if (circle && circle.members) {
                circle.members.forEach(m => uniqueMembers.add(m));
            }
        });
        return uniqueMembers.size;
    };

    // Update bytes loaded for demo
    useEffect(() => {
        const baseBytes = liteMode ? 45 : 450;
        setBytesLoaded(baseBytes);
    }, [liteMode]);

    const value = {
        // Auth
        currentUser,
        userProfile,
        authLoading,
        handleSignIn,
        handleSignOut,

        // Data
        circles,
        posts,
        users, // Exported users
        loading,
        isOnboarded,
        setIsOnboarded,
        completeOnboarding,

        // Settings
        liteMode,
        toggleLiteMode,
        darkMode,
        activeCircle,
        setActiveCircle,

        // UI
        toast,
        bytesLoaded,
        bytesSaved,
        privacyStats,

        // Functions
        getUserById,
        getCircleById,
        createCircle,
        createPost,
        likePost,
        addComment,
        revokePostAccess,
        showToast,
        getFilteredPosts,
        getCircleMembersCount,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
            {toast && (
                <div className={`toast toast-${toast.type} fixed bottom-20 left-1/2 -translate-x-1/2 z-[100]`} role="alert" aria-live="polite">
                    {toast.message}
                </div>
            )}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
