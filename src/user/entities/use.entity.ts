import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity("authuser")
export class User extends AbstractEntity<User>{
  @Column({ unique: true, length: 20 })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;
}
