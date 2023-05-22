import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeormConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModule> => {
  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: ['dist/modules/**/entities/*.js'],
    synchronize: true,
  };
};
