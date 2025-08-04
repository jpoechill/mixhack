"use client";

import { useState } from "react";
import translations from "../data/translations.json";
import projectsData from "../data/projects.json";
import commentsData from "../data/comments.json";
import categoriesData from "../data/categories.json";

// Type definitions
type Comment = {
  id: number;
  author: string;
  text: string;
  timeAgo: string;
  upvotes: number;
};

type CommentsData = {
  [key: string]: Comment[];
};

// Sample comments data with translations

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [language, setLanguage] = useState("en");
  const [expandedComments, setExpandedComments] = useState<number[]>([]);
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [allComments, setAllComments] = useState(commentsData);

  const t = translations[language as keyof typeof translations];
  const projects = projectsData[language as keyof typeof projectsData];
  const currentComments = (allComments[language as keyof typeof allComments] as CommentsData) || {};
  const categories = categoriesData[language as keyof typeof categoriesData];

  const filteredProjects = selectedCategory === "All" || selectedCategory === "ទាំងអស់"
    ? projects
    : projects.filter(p => p.tags.some(tag => tag === selectedCategory));

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "km" : "en");
    // Reset selected category when switching languages
    setSelectedCategory(language === "en" ? "ទាំងអស់" : "All");
  };

  const toggleComments = (projectId: number) => {
    setExpandedComments(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleCommentInput = (projectId: number, value: string) => {
    setCommentInputs(prev => ({
      ...prev,
      [projectId]: value
    }));
  };

  const addComment = (projectId: number) => {
    const commentText = commentInputs[projectId];
    if (!commentText?.trim()) return;

    const newComment = {
      id: Date.now(),
      author: "Anonymous",
      text: commentText,
      timeAgo: "Just now",
      upvotes: 0
    };

    setAllComments(prev => ({
      ...prev,
      [language]: {
        ...(prev[language as keyof typeof prev] as CommentsData),
        [projectId.toString()]: [...((prev[language as keyof typeof prev] as CommentsData)?.[projectId.toString()] || []), newComment]
      }
    }));

    setCommentInputs(prev => ({
      ...prev,
      [projectId]: ""
    }));
  };

  const upvoteComment = (projectId: number, commentId: number) => {
    setAllComments(prev => ({
      ...prev,
      [language]: {
        ...(prev[language as keyof typeof prev] as CommentsData),
        [projectId.toString()]: ((prev[language as keyof typeof prev] as CommentsData)?.[projectId.toString()] || []).map((comment: Comment) =>
          comment.id === commentId
            ? { ...comment, upvotes: comment.upvotes + 1 }
            : comment
        )
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
              <span className="text-sm text-gray-500">|</span>
              <span className="text-sm text-gray-600">{t.subtitle}</span>
            </div>
            <div className="flex items-center space-x-3">
              <button className="text-sm text-gray-600 hover:text-gray-900">{t.submit}</button>
              <button className="text-sm text-gray-600 hover:text-gray-900">{t.login}</button>
              <button
                onClick={toggleLanguage}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors font-medium"
              >
                {language === "en" ? "ខ្មែរ" : "EN"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors whitespace-nowrap flex-shrink-0 ${selectedCategory === category
                  ? "bg-orange-100 text-orange-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project List - Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-2">
        <div className="bg-white rounded border border-gray-200">
          {filteredProjects.map((project, index) => (
            <div key={project.id} className={`py-2 px-3 hover:bg-gray-50 transition-colors ${index !== filteredProjects.length - 1 ? 'border-b border-gray-100' : ''
              }`}>
              {/* Main Project Row */}
              <div className="flex items-center">
                {/* Upvote Button */}
                <div className="flex flex-col items-center mr-2">
                  <button className="text-gray-400 hover:text-orange-500 transition-colors text-xs">
                    ▲
                  </button>
                  <span className="text-xs text-gray-500 font-medium">{project.upvotes}</span>
                </div>

                {/* Project Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm">{project.image}</span>
                        <h3 className="text-sm font-medium text-gray-900">
                          <a href={project.url} className="hover:underline" target="_blank" rel="noopener noreferrer">
                            {project.title}
                          </a>
                        </h3>
                        <span className="text-xs text-gray-500">({project.url.replace('https://', '').replace('http://', '')})</span>
                      </div>

                      <p className="text-xs text-gray-600">
                        {project.description}
                      </p>
                    </div>

                    {/* Right Side: Metadata and Tags */}
                    <div className="flex flex-col items-end space-y-1 ml-2 flex-shrink-0">
                      {/* Metadata */}
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>{project.upvotes} {t.points}</span>
                        <span>{t.by} {project.author}</span>
                        <span>{project.timeAgo}</span>
                        <span>|</span>
                        <button
                          onClick={() => toggleComments(project.id)}
                          className="hover:underline"
                        >
                          {currentComments[project.id.toString()]?.length || 0} {t.comments}
                        </button>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 justify-end">
                        {project.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="inline-block bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              {expandedComments.includes(project.id) && (
                <div className="mt-3 ml-8 border-l-2 border-gray-200 pl-4">
                  {/* Add Comment */}
                  <div className="mb-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={commentInputs[project.id] || ""}
                        onChange={(e) => handleCommentInput(project.id, e.target.value)}
                        placeholder={t.addComment}
                        className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && addComment(project.id)}
                      />
                      <button
                        onClick={() => addComment(project.id)}
                        className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                      >
                        {t.reply}
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-2">
                    {currentComments[project.id.toString()]?.map((comment: Comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded p-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium text-gray-700">{comment.author}</span>
                              <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                            </div>
                            <p className="text-xs text-gray-600">{comment.text}</p>
                          </div>
                          <button
                            onClick={() => upvoteComment(project.id, comment.id)}
                            className="text-xs text-gray-400 hover:text-orange-500 ml-2"
                          >
                            ▲ {comment.upvotes}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center py-4">
          <button className="text-sm text-gray-600 hover:text-gray-900">
            {t.more}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            <div className="flex justify-center space-x-4 mb-2">
              <a href="#" className="hover:text-gray-900">{t.footer.submit}</a>
              <span>|</span>
              <a href="#" className="hover:text-gray-900">{t.footer.about}</a>
              <span>|</span>
              <a href="#" className="hover:text-gray-900">{t.footer.contact}</a>
              <span>|</span>
              <a href="#" className="hover:text-gray-900">{t.footer.github}</a>
            </div>
            <div className="text-xs text-gray-400">
              Search: <input type="text" className="border border-gray-300 rounded px-2 py-1 text-xs w-64" placeholder={t.search} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
