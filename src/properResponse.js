const Pool = require("pg").Pool;
var pool;

async function properResponse(command, user_id, user_name, time) {
    if (!pool) {
        console.log('Pool initialized.');
        buildPool();
    }

    switch (command) {
        case '/running':
        case '/biking':
            insertNewActivity(command, user_id, user_name, time)
            return 'Recorded !';
        case '/leaderboard':
            const leaderboardResult = await getLeaderboard();
            return leaderboardResult;
        case '/mostactiveacitiviesofusers':
            const mostActiveUsersResult = await getMostActiveActivityOfUser();
            return mostActiveUsersResult;
        default:
            return new Error('Command not found')
    }
}

// #region User Methods

const getUserBySlackId = (slack_id) => {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT * FROM users WHERE slack_id=$1 LIMIT 1",
            [slack_id],
            (error, results) => {
                if (error) {
                    return reject(new Error(error.message))
                }
                return resolve(results.rows[0]);
            }
        );
    });
}

async function insertUser(slack_id, name) {
    return new Promise((resolve, reject) => {
        pool.query(
            "INSERT INTO users (slack_id, name) VALUES ($1, $2)",
            [slack_id, name],
            (error, results) => {
                if (error) {
                    return reject(new Error(error.message))
                }
                return resolve(getUserBySlackId(slack_id));
            }
        );
    });
}
//#endregion

// #region Activity Methods
async function getActivityByCommand(command) {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT * FROM activity WHERE name=$1 LIMIT 1",
            [command],
            (error, results) => {
                if (error) {
                    return reject(new Error(error.message))
                }
                return resolve(results.rows[0]);
            }
        );
    });
}
//#endregion

// #region User Activity Methods
async function insertNewActivity(command, user_id, user_name, time) {
    var user = await getUserBySlackId(user_id);
    if (!user) {
        user = await insertUser(user_id, user_name);
    }

    var activity = await getActivityByCommand(command);
    if (user && activity) {
        return await insertUserActivity(user.id, activity.id, (time * activity.multiplication_factor), new Date())
    }
    return 'User and/or activity not found !';
}

async function insertUserActivity(user_id, activity_id, point, created_on) {
    return new Promise((resolve, reject) => {
        pool.query(
            "INSERT INTO user_activity (user_id, activity_id, point, created_on) VALUES ($1, $2, $3, $4)",
            [user_id, activity_id, point, created_on],
            (error, results) => {
                if (error) {
                    return reject(new Error(error.message))
                }
                return 'Recorded';
            }
        );
    });
}

async function getLeaderboard() {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT u.name AS User, a.name AS Activity, sub.point AS Point FROM ( SELECT ua.user_id, ua.activity_id, SUM(ua.point) AS point FROM user_activity ua WHERE ua.created_on >= (NOW() - interval '1 hour') GROUP BY ua.user_id, ua.activity_id ORDER BY SUM(ua.point) DESC ) AS sub INNER JOIN users u ON sub.user_id = u.id INNER JOIN activity a ON sub.activity_id = a.id LIMIT 3",
            [],
            (error, results) => {
                if (error) {
                    console.log('\n what \n');
                    return reject(new Error(error.message));
                }
                var resultText = '';
                for (i = 0; i < results.rows.length; i++) {
                    if (i == 0) {
                        resultText = resultText + '   User     Activity  Point\n';
                    }
                    resultText = resultText + ((i + 1) + '- ' + results.rows[i].user + ' ' + results.rows[i].activity + ' ' + results.rows[i].point + '\n');
                }
                return resolve(resultText);
            }
        );
    });
}

async function getMostActiveActivityOfUser() {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT DISTINCT ON (user_id) user_id, activity_id, cnt, u.name, a.name AS activity_name FROM (SELECT  user_id, activity_id, cnt, RANK() OVER (PARTITION BY user_id ORDER BY cnt DESC) AS rn FROM ( SELECT user_id, activity_id, COUNT(activity_id) AS cnt FROM user_activity WHERE created_on >= (NOW() - interval '1 hour') GROUP BY user_id, activity_id) t) s INNER JOIN users u ON s.user_id = u.id INNER JOIN activity a ON s.activity_id = a.id WHERE s.rn = 1",
            [],
            (error, results) => {
                if (error) {
                    return reject(new Error(error.message));
                }
                var resultText = '';
                for (i = 0; i < results.rows.length; i++) {
                    if (i == 0) {
                        resultText = resultText + '\n\n\n User  Activity - Count \n\n';
                    }
                    resultText = resultText + results.rows[i].name + '  ' + results.rows[i].activity_name + ' - ' + results.rows[i].cnt + '\n';
                }
                return resolve(resultText);
            }
        );
    });
}
//#endregion

const buildPool = () => {
    // Create a connection to the Heroku Postgresql Db for each time.
    pool = new Pool({
        user: process.env.USER,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: process.env.DB_PORT,
        ssl: {
            require: true, // This will help you. But you will see nwe error
            rejectUnauthorized: false // This line will fix new error
        }
    });
}

module.exports = properResponse