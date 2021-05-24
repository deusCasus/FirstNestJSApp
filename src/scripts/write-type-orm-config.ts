import { configService } from '../config/config.service';
import fs = require('fs');

const dataAsString = JSON.stringify(configService.getTypeOrmConfig(), null, 2);
fs.writeFileSync('ormconfig.json', dataAsString);
