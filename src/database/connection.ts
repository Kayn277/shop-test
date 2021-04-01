import { createConnection, ConnectionOptions } from 'typeorm';
import 'reflect-metadata';

const connectionOptions: ConnectionOptions = {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: +process.env.DB_PORT || 3306,
    database: process.env.DB_SCHEMA || 'db_test',
    username: process.env.DB_LOGIN || 'login',
    password: process.env.DB_PASSWORD || 'password',
    entities: ['src/**/*.entity.ts'],
    synchronize: true,
    logging: false
}

const connection = createConnection(connectionOptions);

export default connection;