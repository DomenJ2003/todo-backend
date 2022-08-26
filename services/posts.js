const db = require("./db");

class Posts {
  static getAllPosts() {
    return new Promise((resolve) => {
      const sql = `
                select posts.*, users.name, users.email from posts
                inner join users on users.id = posts.user_id
            `;
      db.all(sql, [], (err, rows) => {
        resolve(rows);
      });
    });
  }

  static getPostsByUserId(id) {
    return new Promise((resolve) => {
      const sql = `
                select posts.*, users.name, users.email from posts
                inner join users on users.id = posts.user_id
                where posts.user_id = ?
            `;
      db.all(sql, [id], (err, rows) => {
        resolve(rows);
      });
    });
  }

  static insertPost({ title, content, date, image, user_id }) {
    const insert =
      "insert into posts (date, title, content, image, user_id) values (?,?,?,?,?);";
    db.run(insert, [date, title, content, image, user_id]);
    return true;
  }

  static deletePost(id) {
    const sql = "DELETE from posts WHERE id = ?";
    db.run(sql, [id]);
    return true;
  }
}

module.exports = Posts;
