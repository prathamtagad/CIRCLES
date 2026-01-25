import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getUserProfile, updateUserProfile } from '../firebase/auth';
import { getUserPosts, followUser, unfollowUser, checkIsFollowing } from '../firebase/firestore';
import { uploadProfileImage } from '../firebase/storage';
import PostCard from '../components/PostCard';
import {
    MapPin,
    Link as LinkIcon,
    Calendar,
    Edit3,
    Camera,
    Grid,
    List,
    Check,
    X
} from 'lucide-react';

export default function Profile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { currentUser, userProfile: currentUserProfile, circles, loading: appLoading } = useApp();

    // Logic to determine which user to show
    const isOwnProfile = !userId || userId === currentUser?.uid;
    const targetUserId = isOwnProfile ? currentUser?.uid : userId;

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('posts');
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        displayName: '',
        bio: '',
        location: '',

        website: '',
        photoURL: ''
    });

    const fileInputRef = useRef(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Fetch Profile & Posts
    useEffect(() => {
        async function fetchData() {
            if (!targetUserId) return;
            setLoading(true);

            try {
                // 1. Get Profile Data
                let userData = null;
                if (isOwnProfile && currentUserProfile) {
                    userData = currentUserProfile;
                } else {
                    const res = await getUserProfile(targetUserId);
                    if (res.success) userData = res.data;
                }

                if (userData) {
                    setProfile(userData);
                    setEditForm({
                        displayName: userData.displayName || '',
                        bio: userData.bio || '',
                        location: userData.location || '',

                        website: userData.website || '',
                        photoURL: userData.photoURL || ''
                    });
                }

                // 2. Get User Posts
                const postsRes = await getUserPosts(targetUserId);
                if (postsRes.success) {
                    setPosts(postsRes.data);
                }

                // 3. Check Follow Status
                if (!isOwnProfile && currentUser) {
                    const followRes = await checkIsFollowing(currentUser.uid, targetUserId);
                    if (followRes.success) {
                        setIsFollowing(followRes.isFollowing);
                    }
                }
            } catch (err) {
                console.error("Profile load error", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [targetUserId, isOwnProfile, currentUserProfile]);

    // Handle Profile Update
    const handleSaveProfile = async () => {
        if (!currentUser) return;

        // Optimistic update
        const updatedProfile = { ...profile, ...editForm };
        setProfile(updatedProfile);
        setIsEditing(false);

        await updateUserProfile(currentUser.uid, editForm);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        const res = await uploadProfileImage(currentUser.uid, file);
        setUploadingImage(false);

        if (res.success) {
            setEditForm(prev => ({ ...prev, photoURL: res.url }));
            setProfile(prev => ({ ...prev, photoURL: res.url })); // Show preview immediately
        } else {
            console.error("Upload failed", res.error);
            // Optionally show toast/alert
        }
    };

    const handleToggleFollow = async () => {
        if (!currentUser || followLoading) return;
        setFollowLoading(true);

        const newStatus = !isFollowing;
        // Optimistic UI update
        setIsFollowing(newStatus);

        // Optimistic count update (for display only until refresh)
        setProfile(prev => ({
            ...prev,
            followersCount: Math.max(0, (prev.followersCount || 0) + (newStatus ? 1 : -1))
        }));

        let res;
        if (newStatus) {
            res = await followUser(currentUser.uid, targetUserId);
        } else {
            res = await unfollowUser(currentUser.uid, targetUserId);
        }

        if (!res.success) {
            // Revert on failure
            setIsFollowing(!newStatus);
            setProfile(prev => ({
                ...prev,
                followersCount: Math.max(0, (prev.followersCount || 0) + (newStatus ? -1 : 1))
            }));
            console.error(res.error);
        }

        setFollowLoading(false);
    };

    const formatCount = (num) => {
        if (!num) return 0;
        if (num > 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num > 1000) return (num / 1000).toFixed(1) + 'k';
        return num;
    };

    if (loading) {
        return (
            <div className="flex justify-center pt-20">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center pt-20 text-slate-500">
                <p>User not found</p>
                <button onClick={() => navigate('/')} className="mt-4 btn btn-ghost">Go Home</button>
            </div>
        );
    }

    return (
        <div className="pb-20">
            {/* Header / Cover */}
            <div className="h-32 md:h-48 bg-gradient-to-r from-violet-600 to-indigo-600 relative">
                {/* Cover Image Placeholder */}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Profile Info */}
            <div className="px-4 relative -mt-16 sm:-mt-20">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">

                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#030712] overflow-hidden bg-slate-800">
                            {profile.photoURL ? (
                                <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-500">
                                    {profile.displayName?.charAt(0)}
                                </div>
                            )}
                        </div>

                        {isOwnProfile && isEditing && (
                            <>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <div
                                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer transition-opacity hover:bg-black/60"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {uploadingImage ? (
                                        <div className="w-8 h-8 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Camera className="text-white" />
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex-1 w-full sm:w-auto flex justify-end gap-2 mt-2 sm:mt-0 sm:mb-4">
                        {isOwnProfile ? (
                            isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="btn btn-ghost"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        className="btn btn-primary flex items-center gap-2"
                                    >
                                        <Check size={18} /> Save
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-secondary flex items-center gap-2"
                                >
                                    <Edit3 size={18} /> Edit Profile
                                </button>
                            )
                        ) : (
                            <button
                                onClick={handleToggleFollow}
                                disabled={followLoading}
                                className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'} min-w-[100px]`}
                            >
                                {followLoading ? '...' : (isFollowing ? 'Following' : 'Follow')}
                            </button>
                        )}
                    </div>
                </div>

                {/* User Details */}
                <div className="mt-4 space-y-4">
                    {isEditing ? (
                        <div className="space-y-4 max-w-lg animate-fade-in">
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold">Display Name</label>
                                <input
                                    type="text"
                                    value={editForm.displayName}
                                    onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                                    className="input mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold">Bio</label>
                                <textarea
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                    className="input mt-1 h-24 resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold">Location</label>
                                    <input
                                        type="text"
                                        value={editForm.location}
                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                        className="input mt-1"
                                        placeholder="City, Country"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold">Website</label>
                                    <input
                                        type="text"
                                        value={editForm.website}
                                        onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                                        className="input mt-1"
                                        placeholder="https://"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">{profile.displayName}</h1>
                            <p className="text-slate-500">@{profile.displayName?.toLowerCase().replace(/\s+/g, '')}</p>

                            {profile.bio && (
                                <p className="text-slate-300 max-w-2xl whitespace-pre-wrap">
                                    {profile.bio}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 pt-2">
                                {profile.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin size={14} /> {profile.location}
                                    </div>
                                )}
                                {profile.website && (
                                    <div className="flex items-center gap-1">
                                        <LinkIcon size={14} />
                                        <a href={profile.website} target="_blank" rel="noreferrer" className="text-violet-400 hover:underline">
                                            {profile.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} /> Joined {new Date(profile.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-6 py-4 border-t border-white/5 mt-4">
                                <div className="flex gap-2">
                                    <strong className="text-white">{posts.length}</strong> <span className="text-slate-500">Posts</span>
                                </div>
                                <div className="flex gap-2">
                                    {/* Mock stats for visual completeness */}
                                    <strong className="text-white">{formatCount(profile.followingCount)}</strong> <span className="text-slate-500">Following</span>
                                </div>
                                <div className="flex gap-2">
                                    <strong className="text-white">{formatCount(profile.followersCount)}</strong> <span className="text-slate-500">Followers</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Tabs */}
            <div className="mt-4 border-b border-white/5 sticky top-14 bg-[#030712]/80 backdrop-blur-xl z-20">
                <div className="flex justify-around">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`p-4 flex-1 text-center font-medium transition-colors relative ${activeTab === 'posts' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Posts
                        {activeTab === 'posts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('circles')}
                        className={`p-4 flex-1 text-center font-medium transition-colors relative ${activeTab === 'circles' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Circles
                        {activeTab === 'circles' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500"></div>}
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-4">
                {activeTab === 'posts' && (
                    <div className="space-y-4">
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <div className="py-20 text-center text-slate-500">
                                <Grid className="mx-auto mb-4 opacity-50" size={48} />
                                <p>No posts yet</p>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'circles' && (
                    <div className="py-20 text-center text-slate-500">
                        <List className="mx-auto mb-4 opacity-50" size={48} />
                        <p>Circles are private</p>
                    </div>
                )}
            </div>
        </div>
    );
}
