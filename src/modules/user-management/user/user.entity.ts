import * as bcrypt from 'bcrypt';
import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'users' })
export class User extends AbstractEntity {
  @Field()
  @Column({ name: 'email' })
  email: string;

  @Field()
  @Column({ name: 'code', unique: true })
  code: string;

  @Field({ nullable: true })
  @Column({ name: 'password', nullable: true })
  password: string;

  @Field()
  @Column({ name: 'phone', nullable: true })
  phone: string;

  @Field()
  @Column({ name: 'address', nullable: true })
  address: string;

  @Field()
  @Column({ name: 'gender', nullable: true })
  gender: string;

  @Field()
  @Column({ name: 'department', nullable: true })
  department: string;

  @Field()
  @Column({ name: 'contract_start_date', nullable: true, type: 'date' })
  contractStartDate: Date;

  @Field()
  @Column({ name: 'contract_end_date', nullable: true, type: 'date' })
  contractEndDate: Date;

  @Field()
  @Column({ name: 'designation', nullable: true })
  designation: string;

  @Field()
  @Column({ name: 'name', nullable: true })
  name: string;

  @Field()
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Field()
  @Column({ name: 'manager_code', nullable: true })
  managerCode: string;

  @Field()
  @Column({ name: 'leave_benefit_code', nullable: true })
  leaveBenefitCode: string;

  @Field()
  @Column({ name: 'worktime_code', nullable: true })
  worktimeCode: string;

  @Field()
  @Column({ name: 'avatar', nullable: true })
  avatar: string;

  @Field()
  @Column({ name: 'provider', nullable: true })
  provider: string;

  async validatePassword(password: string): Promise<boolean> {
    const hashPassword = await bcrypt.compare(password, this.password);
    return hashPassword;
  }
}
