const db = require("./db");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SECRET_KEY, TOKEN_KEY } = require("./config");

class Users {
  static getAllUsers() {
    return new Promise((resolve) => {
      const sql = "select * from users";
      db.all(sql, [], (err, rows) => {
        resolve(rows);
      });
    });
  }

  static getProfile(id) {
    return new Promise((resolve) => {
      const sql = "select * from users where id = ?";
      db.all(sql, [id], (err, rows) => {
        resolve(rows);
      });
    });
  }

  static register({ name, email, password }) {
    const insert = "insert into users (name, email, password) values (?,?,?);";
    db.run(insert, [name, email, md5(SECRET_KEY + email + password)]);
    return true;
  }

  static login({ email, password }) {
    return new Promise((resolve) => {
      const firstSql = "select * from users where email = ?";
      db.all(firstSql, [email], (err, rows) => {
        if (!rows.length) {
          resolve([false, "User not found", null]);
        } else {
          const hashedPassword = md5(SECRET_KEY + email + password);
          const secondSql =
            "select * from users where email = ? and password = ?";
          db.all(secondSql, [email, hashedPassword], (err, rows2) => {
            if (!rows2.length) {
              resolve([false, "Invalid password", null]);
            } else {
              let jwtToken = jwt.sign(
                { userId: rows2[0]["id"], email },
                TOKEN_KEY,
                {
                  expiresIn: "2h",
                }
              );
              resolve([true, "", jwtToken]);
            }
          });
        }
      });
    });
  }

  static getByEmail(email) {
    return new Promise((resolve) => {
      const sql = "select * from users where email = ?";
      db.all(sql, [email], (err, rows) => {
        resolve(rows.length ? rows[0] : {});
      });
    });
  }
}

module.exports = Users;
