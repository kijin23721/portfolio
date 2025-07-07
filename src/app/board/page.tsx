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

  // データベースから投稿を取得する関数
  const fetchPosts = async () => {
    const response = await fetch('/api/board');
    const data = await response.json();
    setPosts(data);
  };

  // ページが最初に読み込まれた時に投稿を取得
  useEffect(() => {
    fetchPosts();
  }, []);

  // フォーム送信時の処理
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!author || !title || !content) {
      alert("すべての項目を入力してください。");
      return;
    }

    // APIにPOSTリクエストを送信して投稿を保存
    await fetch('/api/board', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ author, title, content }),
    });

    // フォームを空にする
    setAuthor('');
    setTitle('');
    setContent('');

    // 投稿リストを再読み込みして、新しい投稿を画面に反映
    fetchPosts();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">掲示板 (SQLite版)</h1>

      {/* 投稿フォーム */}
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

      {/* 投稿一覧 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">投稿一覧</h2>
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded-md shadow-sm">
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
    </div>
  );
}
