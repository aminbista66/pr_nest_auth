import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/use.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'database.sqlite',
            synchronize: true,
            autoLoadEntities: true,
        })
    ]
})
export class DatabaseModule {}