import Database from 'better-sqlite3';

const db = new Database('bulletinboard.db', { verbose: console.log });

function initialize() {
  const createTableStmt = `
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  db.exec(createTableStmt);
  console.log('Database and "posts" table initialized successfully.');

  const postCount = db.prepare('SELECT COUNT(*) as count FROM posts').get();
  if (postCount.count === 0) {
    const insert = db.prepare('INSERT INTO posts (author, title, content) VALUES (?, ?, ?)');
    insert.run(
      "一般ユーザー",
      "最初の投稿",
      "これはデータベースから読み込まれた最初の投稿です。"
    );
    // ===== ここを修正しました =====
    // alert()を削除し、代わりに文字を赤くする無害なHTMLインジェクションに変更します。
    // これでポップアップは永久に表示されませんが、脆弱性があることは確認できます。
    insert.run(
      "<strong style='color: red;'>脆弱性テストユーザー</strong>",
      "脆弱性テスト（HTMLインジェクション）",
      "この投稿の名前欄は、HTMLが注入できる脆弱な状態です。"
    );
    // ===== ここまで =====
    console.log('Initial posts inserted.');
  }
}

initialize();

