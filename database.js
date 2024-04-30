let { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: 'root',
    database: 'new_task_node'
})

client.connect((err) => {
    if (err) {
        console.log('Error connectin to POSTGRESQL', err);
        return;
    }
    console.log('Postgers connected');
});

module.exports=client;