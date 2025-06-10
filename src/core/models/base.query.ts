import { Allow } from 'class-validator';

export class BaseQuery {
  @Allow()
  page?: number;

  @Allow()
  limit?: number;

  @Allow()
  orderBy?: string;

  @Allow()
  orderType?: 'ASC' | 'DESC';

  get take(): number {
    return Number(this.limit) || 0;
  }

  get skip(): number {
    const page = (Number(this.page) || 1) - 1;
    return (page < 0 ? 0 : page) * this.take;
  }
}
