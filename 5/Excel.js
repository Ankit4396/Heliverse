
// Needs to run on a new system npm install xlsx
const xlsx = require('xlsx');

mongodb = {


    // mongo_string needs to fill in order to connect to a database collection

    connection_string: 'mongodb://localhost:27017/Temp',

    connection_options: {
        poolSize: 5,
        tls: true,
        autoReconnect: true,
        reconnectTries: 30,
        reconnectInterval: 2000,
        noDelay: true,
        keepAlive: true,
        connectTimeoutMS: 10000,
        ignoreUndefined: true,
        appname: 'excel',
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
};



const mongoDB = require('mongodb');
const { resolve } = require('path');

const mongoClientInstance = new mongoDB.MongoClient(
    mongodb.connection_string,
    mongodb.connection_options,
);



function getClient() {

    return new Promise(
        (resolve, reject) => {

            if (mongoClientInstance.isConnected()) {

                resolve(mongoClientInstance);
                return;

            }

            mongoClientInstance.connect()
                .then(client => {

                    resolve(client);

                })
                .catch(err => {

                    console.error('[GET MONGODB CLIENT]', 'Some error occurred', err);
                    resolve(null);

                });

        },
    );

};


function getDatabase() {

    return new Promise(
        (resolve, reject) => {

            getClient()
                .then(client => {

                    resolve(client.db());

                })
                .catch(err => {

                    console.error('[GET DATABASE]', 'Some error occurred', err);
                    resolve(null);

                });

        },
    );

};




const filePath = process.argv.slice(2)[0];
const workbook = xlsx.readFile(filePath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

let posts = [];
let post = {};

for (let cell in worksheet) {
    const cellAsString = cell.toString();

    if (cellAsString[1] !== 'r' && cellAsString[1] !== 'm' && cellAsString[1] > 1) {
        if (cellAsString[0] === 'A') {
            post.title = worksheet[cell].v;
        }
        if (cellAsString[0] === 'B') {
            post.author = worksheet[cell].v;
        }
        if (cellAsString[0] === 'C') {
            post.released = worksheet[cell].v;
            posts.push(post);
            post = {};
        }
    }
}








        getDatabase().then(db=>{

            posts.forEach(element=>{
                db.collection('count_signup').insertOne(element);
            })

        });


