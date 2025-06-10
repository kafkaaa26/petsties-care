import { config } from '@core/config/app.config';
import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CommonService {
  constructor(private readonly i18n: I18nService) {}
  nowDatetime(): number {
    return moment().unix();
  }

  formatDate(date: Date, format: string) {
    return moment(date).format(format);
  }

  formatDateFromEpochTime(epochTime: number, format: string) {
    if (!epochTime || isNaN(epochTime)) {
      return '';
    }

    return moment.unix(epochTime).tz(config.timezone).format(format);
  }

  randomString(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@_!';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }

    return result;
  }

  generateUUIDv4(): string {
    return uuidv4();
  }

  translate(key: string): string {
    return this.i18n.t(key);
  }
}
