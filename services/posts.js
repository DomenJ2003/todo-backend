const db = require('./db');

class Posts {
    static getAllPosts(){
        return new Promise(resolve => {
            const sql = 'select * from posts'
            db.all(sql, [], (err, rows) =>{
                resolve(rows)
            });
        })
    }

    static insertPost({title, content, date}){
        const insert = 'INSERT INTO posts (date, title, content) VALUES (?,?,?)'
        db.run(insert, [date,title,content])
        return true;
        //db.run(insert, ["user","user@example.com",("user123456")])
    }

    static deletePost(id){
        const sql = "DELETE from posts WHERE id = ?"
        db.run(sql, [id]);
        return true;
    }
}

module.exports = Posts