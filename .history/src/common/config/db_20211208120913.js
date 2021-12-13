'use strict';
/**
 * db config
 * @type {Object}
 */
export default {
    type: 'mysql',
    log_sql: true,
    log_connect: true,
    adapter: {
        mysql: {
            host: '172.18.254.203',
            port: '',
            database: 'front_db',
            user: 'admin',
            password: 'bzwR680B8VmCs^92#5',
            prefix: '',
            encoding: 'utf8'
        },
        mongo: {

        }
    }
};

// export default {
//     type: 'mysql',
//     log_sql: true,
//     log_connect: true,
//     adapter: {
//         mysql: {
//             host: '127.0.0.1',
//             port: '',
//             database: 'ci',
//             user: 'root',
//             password: '111111',
//             prefix: '',
//             encoding: 'utf8'
//         },
//         mongo: {

//         }
//     }
// };
