const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbuser, dbpass } = require("../secrets.json");
    db = spicedPg(`postgres:${dbuser}:${dbpass}@localhost:5432/petition`);
}

exports.getSigners = function() {
    return db
        .query(
            `SELECT users.first AS first, users.last AS last, profiles.city AS city, profiles.url AS url, profiles.age AS age
        FROM petition
        LEFT JOIN users
ON petition.user_id = users.id
LEFT JOIN profiles
ON users.id=profiles.user_id;
`
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getCitySigners = function(city) {
    return db
        .query(
            `SELECT users.first AS first, users.last AS last, profiles.url AS url, profiles.age AS age
        FROM petition
        JOIN users
ON petition.user_id = users.id
LEFT JOIN profiles
ON users.id=profiles.user_id
WHERE LOWER(city) = LOWER($1)
`,
            [city]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.addSigner = function(signature, user_id) {
    return db
        .query(
            `INSERT INTO petition (signature,user_id)
        VALUES ($1, $2)
        RETURNING id`,
            [signature, user_id]
        )
        .then(({ rows }) => {
            return rows[0].id;
        });
};

exports.getSignature = function(id) {
    return db
        .query(`SELECT * FROM petition WHERE user_id=$1`, [id])
        .then(({ rows }) => {
            return rows;
        });
};
exports.deleteSignature = function(user_id) {
    return db.query(`DELETE FROM petition WHERE user_id=$1`, [user_id]);
};

exports.getNumber = function() {
    return db.query(`SELECT COUNT (*) FROM petition`).then(({ rows }) => {
        return rows[0].count;
    });
};

exports.addRegister = function(first, last, email, password) {
    return db
        .query(
            `INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, first`,
            [first, last, email, password]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getHash = function(email) {
    return db
        .query(`SELECT * FROM users WHERE email=$1`, [email])
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.addData = function(age, city, url, user_id) {
    return db.query(
        `INSERT INTO profiles (age, city, url, user_id)
        VALUES ($1, $2, $3, $4)
        `,
        [age || null, city || null, url || null, user_id]
    );
};

exports.getEditData = function(user_id) {
    return db
        .query(
            `SELECT users.first AS first, users.last AS last, users.email AS email, profiles.age AS age, profiles.city AS city, profiles.url AS url
            FROM users
            JOIN profiles
            ON users.id=profiles.user_id
            WHERE users.id = ($1)`,
            [user_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.updateUserDataNoPass = function(first, last, email, user_id) {
    return db.query(
        `UPDATE users
        SET first = ($1), last = ($2), email =($3)
        WHERE id=($4) RETURNING first`,
        [first, last, email, user_id]
    );
};

exports.updateUserDataPass = function(first, last, email, hash, user_id) {
    return db.query(
        `UPDATE users
        SET first = ($1), last = ($2), email =($3), password=($4)
        WHERE id=($5)`,
        [first, last, email, hash, user_id]
    );
};

exports.updateProfiles = function(age, city, url, user_id) {
    return db.query(
        `INSERT INTO profiles (age, city, url, user_id)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id)
            DO UPDATE SET age = ($1), city = ($2), url =($3)`,
        [age || null, city || null, url || null, user_id]
    );
};
