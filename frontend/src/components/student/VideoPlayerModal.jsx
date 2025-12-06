import React, { useState } from 'react';
import { X, CheckCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { lecturesApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const VideoPlayerModal = ({ course, lectures, currentLectureIndex, onClose, onLectureComplete }) => {
    const { currentUser } = useAuth();
    const [currentIndex, setCurrentIndex] = useState(currentLectureIndex || 0);
    const [marking, setMarking] = useState(false);
    const [completedLectures, setCompletedLectures] = useState([]);

    const currentLecture = lectures[currentIndex];
    const hasNext = currentIndex < lectures.length - 1;
    const hasPrevious = currentIndex > 0;

    // Extract video ID from URL for embedding
    const getEmbedUrl = (url) => {
        if (!url) return null;

        // YouTube
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            let videoId = null;

            if (url.includes('youtu.be')) {
                // Short URL format: https://youtu.be/VIDEO_ID
                videoId = url.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
            } else if (url.includes('youtube.com/embed/')) {
                // Already embed format
                videoId = url.split('embed/')[1]?.split('?')[0]?.split('&')[0];
            } else {
                // Standard format: https://www.youtube.com/watch?v=VIDEO_ID
                const urlParams = new URLSearchParams(url.split('?')[1]);
                videoId = urlParams.get('v');
            }

            if (videoId) {
                // Add parameters for better embedding
                return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
            }
        }

        // Vimeo
        if (url.includes('vimeo.com')) {
            const videoId = url.split('vimeo.com/')[1]?.split('?')[0]?.split('/')[0];
            if (videoId) {
                return `https://player.vimeo.com/video/${videoId}`;
            }
        }

        // Direct video URL
        return url;
    };

    const handleMarkComplete = async () => {
        if (!currentUser || !course || !currentLecture) return;

        setMarking(true);
        try {
            const courseId = course.id || course._id;
            const lectureId = currentLecture.id || currentLecture._id;

            await lecturesApi.markComplete(courseId, lectureId, currentUser.uid);

            setCompletedLectures(prev => [...prev, lectureId]);

            if (onLectureComplete) {
                onLectureComplete(lectureId);
            }

            // Auto-advance to next lecture if available
            if (hasNext) {
                setTimeout(() => {
                    setCurrentIndex(prev => prev + 1);
                }, 1000);
            }
        } catch (error) {
            console.error('Error marking lecture complete:', error);
        } finally {
            setMarking(false);
        }
    };

    const handleNext = () => {
        if (hasNext) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (hasPrevious) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const embedUrl = getEmbedUrl(currentLecture?.videoUrl);
    const isYouTubeOrVimeo = embedUrl && (embedUrl.includes('youtube.com') || embedUrl.includes('vimeo.com'));

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="w-full h-full max-w-7xl max-h-screen p-4 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-white">
                            {currentLecture?.title}
                        </h2>
                        <p className="text-sm text-gray-300 mt-1">
                            Lecture {currentIndex + 1} of {lectures.length} • {currentLecture?.duration || 'N/A'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Video Player */}
                <div className="flex-1 bg-black rounded-lg overflow-hidden mb-4">
                    {embedUrl ? (
                        isYouTubeOrVimeo ? (
                            <iframe
                                src={embedUrl}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                title={currentLecture?.title}
                            />
                        ) : (
                            <video
                                src={embedUrl}
                                controls
                                className="w-full h-full"
                                controlsList="nodownload"
                            >
                                Your browser does not support the video tag.
                            </video>
                        )
                    ) : (
                        <div className="flex items-center justify-center h-full text-white">
                            <div className="text-center p-8">
                                <p className="text-xl font-semibold mb-2">⚠️ Invalid Video URL</p>
                                <p className="text-gray-300 text-sm">
                                    The video URL for this lecture is not valid or could not be loaded.
                                </p>
                                <p className="text-gray-400 text-xs mt-2">
                                    Please contact your instructor to update the video link.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between bg-gray-900 rounded-lg p-4">
                    <button
                        onClick={handlePrevious}
                        disabled={!hasPrevious}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Previous
                    </button>

                    <button
                        onClick={handleMarkComplete}
                        disabled={marking || completedLectures.includes(currentLecture?.id || currentLecture?._id)}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {marking ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Marking...
                            </>
                        ) : completedLectures.includes(currentLecture?.id || currentLecture?._id) ? (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Completed
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Mark as Complete
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!hasNext}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Description */}
                {currentLecture?.description && (
                    <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                        <h3 className="text-sm font-semibold text-white mb-2">Description</h3>
                        <p className="text-sm text-gray-300">{currentLecture.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoPlayerModal;
