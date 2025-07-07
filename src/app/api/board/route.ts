import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

// データベースファイルに接続します
// ※本番環境ではパスの解決に注意が必要な場合があります
const db = new Database('bulletinboard.db');

// GETリクエスト：すべての投稿を取得
export async function GET() {
  try {
    // createdAt（作成日時）の降順（新しいものが上）で投稿を取得します
    const posts = db.prepare('SELECT * FROM posts ORDER BY createdAt DESC').all();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POSTリクエスト：新しい投稿を作成
export async function POST(request: Request) {
  try {
    const { author, title, content } = await request.json();

    if (!author || !title || !content) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // データベースに新しい投稿を挿入します
    const stmt = db.prepare('INSERT INTO posts (author, title, content) VALUES (?, ?, ?)');
    const info = stmt.run(author, title, content);

    // 作成された投稿のIDを返します
    return NextResponse.json({ id: info.lastInsertRowid }, { status: 201 });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
