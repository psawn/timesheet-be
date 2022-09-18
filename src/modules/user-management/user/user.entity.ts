import * as bcrypt from 'bcrypt';
import { AbstractEntity } from 'src/common/abstracts/entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'users' })
export class User extends AbstractEntity {
  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'phone', nullable: true })
  phone: string;

  @Column({ name: 'address', nullable: true })
  address: string;

  @Column({ name: 'gender', nullable: true })
  gender: string;

  @Column({ name: 'department', nullable: true })
  department: string;

  @Column({ name: 'contract_start_date', nullable: true, type: 'date' })
  contractStartDate: Date;

  @Column({ name: 'contract_end_date', nullable: true, type: 'date' })
  contractEndDate: Date;

  @Column({ name: 'designation', nullable: true })
  designation: string;

  @Column({ name: 'name', nullable: true })
  name: string;

  async validatePassword(password: string): Promise<boolean> {
    const hashPassword = await bcrypt.compare(password, this.password);
    return hashPassword;
  }
}
