const md5 = require("md5");
const db = require("./db");

const TABELS = {
  users: ` CREATE TABLE IF NOT EXISTS  users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name text, 
      email text, 
      password text 
      );`,
  posts: `CREATE TABLE IF NOT EXISTS  posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,   
      date text, 
      title text, 
      content text,
      user_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
  );`,
};

const SEED = {
  users: [
    ["Janez", "janez@gmail.com", md5("test123")],
    ["Žoga", "zoga@gmail.com", md5("test123")],
    ["Sergej", "sergej@gmail.com", md5("test123")],
    ["Domen", "domen@gmail.com", md5("test123")],
    ["Lukec", "lukec@gmail.com", md5("test123")],
  ],
  posts: [
    ["title1", "content1", "2022-08-24T07:55:14.786Z", 1],
    ["title2", "content2", "2022-08-24T07:55:14.786Z", 1],
    ["title3", "content3", "2022-08-24T07:55:14.786Z", 2],
    ["title4", "content4", "2022-08-24T07:55:14.786Z", 4],
    ["title5", "content5", "2022-08-24T07:55:14.786Z", 3],
    ["title6", "content6", "2022-08-24T07:55:14.786Z", 1],
    ["title7", "content7", "2022-08-24T07:55:14.786Z", 5],
    ["title8", "content8", "2022-08-24T07:55:14.786Z", 5],
  ],
};

const INSERTS = {
    users:"insert into users (name, email, password) values (?,?,?);",
    posts: "insert into posts (title, content, date, user_id) values (?,?,?,?);"

}

function runSeed() {

  Object.keys(TABELS).forEach((table) => {
    //console.log(table)
    db.run(TABELS[table], (err) => {
      if (err) {
        console.error(err.message);
        throw err;
      }

      SEED[table].forEach(row=>db.run(INSERTS[table], row))
    });
  });
}

runSeed()
