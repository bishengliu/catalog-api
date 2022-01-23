import {
  BaseEntity,
  Unique,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Version } from './version.entity';
@Entity('service')
@Unique(['service'])
export class Service extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  userId: string;

  @Column({ type: 'varchar', nullable: false })
  service: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Version, (version) => version.service, {
    eager: true,
  })
  versions: Version[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
