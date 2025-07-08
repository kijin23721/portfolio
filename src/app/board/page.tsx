'use client';

import { useState, useEffect, FormEvent } from 'react';

// 投稿データの型を定義
interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const fetchPosts = async () => {
    const response = await fetch('/api/board');
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!author || !title || !content) {
      alert("すべての項目を入力してください。");
      return;
    }
    await fetch('/api/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, title, content }),
    });
    setAuthor('');
    setTitle('');
    setContent('');
    fetchPosts();
  };

  const handleDeleteClick = (id: number) => {
    setPostToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (postToDelete === null) return;
    await fetch(`/api/board?id=${postToDelete}`, {
      method: 'DELETE',
    });
    setPosts(posts.filter(post => post.id !== postToDelete));
    setIsModalOpen(false);
    setPostToDelete(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">掲示板 (SQLite版)</h1>

      {/* ===== ここを修正しました ===== */}
      {/* 省略されていた投稿フォームを完全に記述 */}
      <form onSubmit={handleSubmit} className="mb-10 p-4 border rounded-lg bg-gray-50">
        <div className="mb-4">
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">名前</label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="名無しさん"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="投稿のタイトル"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">本文</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={4}
            placeholder="ここに内容を記入..."
          ></textarea>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
          投稿する
        </button>
      </form>
      {/* ===== ここまで ===== */}

      {/* 投稿一覧 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">投稿一覧</h2>
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded-md shadow-sm relative">
            <button
              onClick={() => handleDeleteClick(post.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              aria-label="削除"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h3 className="text-xl font-semibold" dangerouslySetInnerHTML={{ __html: post.title }} />
            <div className="text-sm text-gray-600 my-2">
              <span>投稿者: </span>
              <span className="font-medium" dangerouslySetInnerHTML={{ __html: post.author }} />
              <span className="ml-4">投稿日時: {new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        ))}
      </div>

      {/* 削除確認モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-bold mb-4">削除の確認</h3>
            <p>この投稿を本当に削除しますか？<br/>この操作は元に戻せません。</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                キャンセル
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                はい、削除します
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
