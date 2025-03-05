import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
  
  @Column()
  mobile: string;

  @Column()
  role: string;
  enum: ['ADMIN', 'EDOTOR', 'VIEWER'];
  
  @Column()
  email: string;

  @Column()
  password: string;
}
