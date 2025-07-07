import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

const db = new Database('bulletinboard.db');

// GETリクエスト：すべての投稿を取得
export async function GET() {
  try {
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
    const stmt = db.prepare('INSERT INTO posts (author, title, content) VALUES (?, ?, ?)');
    const info = stmt.run(author, title, content);
    return NextResponse.json({ id: info.lastInsertRowid }, { status: 201 });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ===== ここから追加 =====
// DELETEリクエスト：指定されたIDの投稿を削除
export async function DELETE(request: Request) {
  try {
    // URLから削除したい投稿のIDを取得します (例: /api/board?id=123)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // データベースから指定されたIDの投稿を削除するSQLを実行します
    const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
    const info = stmt.run(id);

    // 削除が成功したか確認
    if (info.changes > 0) {
      return NextResponse.json({ message: 'Post deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to delete post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
// ===== ここまで =====
