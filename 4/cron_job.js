
// Needs to run on a new system npm install node-cron --save

const cron = require('node-cron');
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
        appname: 'cron-signup',
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


let timestamp = Date.now();

let Query = {} ;
Query =
{
    $match: {
        createdAt: {
            $eq: timestamp
        }
    }
}, {
    $count: 'sum'
}



// setting cron job dailiy at 11:00 p.m

let task = cron.schedule('23 00 * * *', ()=>{
        getDatabase().then(db=>{
            db.collection('Users',function(err,col){


                    col.find(Query).then(err,result=>{
                        if(!err){
                            let details = {
                                total_no_signup:result,
                                createdAt:Date.now(),

                            }

                            db.collection('count_signup').insertOne(details);
                        }
                    }


                }
            );
        });
},

    {
        scheduled:false,
        timezone:"Asia/Mumbai"
    }

    );

        task.start();
        task.stop();
        task.destroy();
