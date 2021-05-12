const Pool = require("pg").Pool;
var pool;

const properResponse = (command, user_id, user_name, time) => {
    switch (command) {
        case '/running':
            return insertNewActivity(command, user_id, user_name, time)
        case '/biking':
            return 'Unauthorized: Be sure you configured the integration to use a valid API key'
        case '/leaderboard':
            return getLeaderboard()
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
                    return resolve(new Error(error.message))
                }
                //console.log('getUserBySlackID : ' + results.rows[0].id);
                return resolve(results.rows[0]);
            }
        );
    });
}

const insertUser = (slack_id, name) => {
    return new Promise((resolve, reject) => {
        pool.query(
            "INSERT INTO users (slack_id, name) VALUES ($1, $2)",
            [slack_id, name],
            (error, results) => {
                if (error) {
                    return resolve(new Error(error.message))
                }
                console.log('User inserted successfully');
                return getUserBySlackId(slack_id);
            }
        );
    });
}
//#endregion

// #region Activity Methods
const getActivityByCommand = (command) => {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT * FROM activity WHERE name=$1 LIMIT 1",
            [command],
            (error, results) => {
                if (error) {
                    return resolve(new Error(error.message))
                }
                return resolve(results.rows[0]);
            }
        );
    });
}
//#endregion

// #region User Activity Methods
const insertNewActivity = (command, user_id, user_name, time) => {
    if (!pool) {
        buildPool();
    }

    var user = getUserBySlackId(user_id);
    if (!user) {
        user = insertUser(user_id, user_name);
    }

    var activity = getActivityByCommand(command);
    if (user && activity) {
        console.log(user.id + ' - ' + activity.id + ' - ' + time + ' * ' + activity.multiplication_factor);
        return insertUserActivity(user.id, activity.id, (time * activity.multiplication_factor), new Date())
    }

    return 'User and/or activity not found !';
}

const insertUserActivity = (user_id, activity_id, point, created_on) => {
    console.log('insertUserActivity');
    console.log(user_id + ' - ' + activity_id + ' - ' + point + ' - ' + created_on);
    return new Promise((resolve, reject) => {
        pool.query(
            "INSERT INTO user_activity (user_id, activity_id, point, created_on) VALUES ($1, $2, $3, $4)",
            [user_id, activity_id, point, created_on],
            (error, results) => {
                if (error) {
                    return resolve(new Error(error.message))
                }
                return resolve('Recorded');
            }
        );
    });
}

const getLeaderboard = () => {
    return '1. ozenc.celik 50\n2. marry.jane 25\n3. john.doe 20';


    pool.query(
        "SELECT * FROM user_activity",
        [],
        (error, results) => {
            if (error) {
                new Error(error.message)
            }
            return results.rows;
        }
    );
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