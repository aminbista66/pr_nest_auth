import { DataSource } from "typeorm";

export default new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    migrations: ['dist/db/migrations/*{.ts,.js}'],
    entities: ['dist/**/*.entity{.ts,.js}'],
})