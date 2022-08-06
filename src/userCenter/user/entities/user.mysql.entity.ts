import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { InternalServerErrorException } from '@nestjs/common';

export enum STATUS_TYPE {
  disabled = 0,
  enabled = 1,
}

export enum ROLE_TYPE {
  simple = 0,
  admin = 1,
  sAdmin = 2,
}

export enum VIP_TYPE {
  level0 = 0,
  level1 = 1,
}
@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 10 })
  username: string;

  @Column({ length: 20, default: null })
  nickName?: string;

  @Column({ select: false })
  password: string;

  @Column({ default: null })
  avatar: string;

  @Column({ default: null })
  email?: string;

  @Column()
  mobile: string;

  @Exclude()
  @Column({ default: null })
  openid: string;

  @Column({ default: STATUS_TYPE.enabled })
  status?: STATUS_TYPE;

  @Column({ default: VIP_TYPE.level0 })
  isVip?: VIP_TYPE;

  @Column({ default: ROLE_TYPE.simple })
  role?: ROLE_TYPE;

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async encryptPwd(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hashSync(this.password, 10);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }
}
