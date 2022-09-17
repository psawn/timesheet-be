import * as bcrypt from 'bcrypt';
import { ConfigService } from 'src/shared/services/config.service';

const configService = new ConfigService();

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(configService.bcryptSalt);
  return await bcrypt.hash(password, salt);
};
