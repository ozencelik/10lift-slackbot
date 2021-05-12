const { Pool, Client } = require('pg')
var pool;
var client;

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

const getLeaderboard = () => {
    return '1. ozenc.celik 50\n2. marry.jane 25\n3. john.doe 20';


    pool.query(
        "SELECT * FROM user_activity",
        [],
        (error, results) => {
            if (error) {
                throw error;
            }

            return results.rows;
        }
    );
}


const insertNewActivity = (command, user_id, user_name, time) => {
    if (!client) {
        console.log('if !pool girdi');
        buildPool();
    }
 
    
    console.log('1');
    client.connect()
    console.log('2');
    client.query('SELECT NOW()', (err, res) => {
        console.log(err, res)
        client.end()
    })
    /*
        pool.query(
            "INSERT INTO user_activity (user_id, activity_id, point, created_on) VALUES ($1, $2, $3, $4)",
            [1, 1, 18, new Date()],
            (error, results) => {
                if (error) {
                    throw error;
                }
                console.log('Sanırım ekledi !!!');
            }
        );
    */
    return 'Unauthorized';
}


const buildPool = () => {
    // Create a connection to the Heroku Postgresql Db for each time.
    client = new Client({
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