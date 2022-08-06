import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum STATUS_TYPE {
  disabled = 0,
  enabled = 1,
}

@Entity('goods')
export class Goods {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  description: string;

  @Column({ type: 'int', default: 0 })
  price: number;

  // 浏览量
  @Column({ type: 'int', default: 0 })
  count: number;

  // 交易量
  @Column({ type: 'int', default: 0, name: 'pay_count' })
  payCount: number;

  @Column({ default: STATUS_TYPE.enabled })
  status?: STATUS_TYPE;

  @Column()
  details: string;

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
}
