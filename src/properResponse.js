const Pool = require("pg").Pool;

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

    return 'Unauthorized';
}


const runQuery = (query) => {

    client
    .query(query)
    .then(res => {
        console.log('Table is successfully created');
    })
    .catch(err => {
        console.error(err);
    })
    .finally(() => {
        client.end();
    });
}



module.exports = properResponse