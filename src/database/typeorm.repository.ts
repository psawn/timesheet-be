import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PaginationConstants } from 'src/common/constants/pagination.enum';
import { PageLimitDto } from 'src/common/dto/page-limit.dto';
import { Repository, SelectQueryBuilder } from 'typeorm';

export class TypeORMRepository<T> extends Repository<T> {
  // only work with one to one relation
  async paginate({ page, limit }: IPaginationOptions, query: any) {
    const options = {
      page: page || PaginationConstants.DEFAULT_PAGE,
      limit: limit || PaginationConstants.DEFAULT_LIMIT_ITEM,
    };

    if (query) {
      return await paginate<T>(query, options);
    }

    return null;
  }

  async customPaginate(options: PageLimitDto, query: SelectQueryBuilder<T>) {
    const page = options.page || PaginationConstants.DEFAULT_PAGE;
    const limit = options.limit || PaginationConstants.DEFAULT_LIMIT_ITEM;
    const offset = (page - 1) * limit;

    query.take(limit).skip(offset);

    const [items, totalItems] = await query.getManyAndCount();

    return {
      items,
      pagination: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: +limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: +page,
      },
    };
  }

  async customeUpsert(conditions: any, properties: any) {
    const entity = await this.findOne({
      where: conditions,
    });

    if (entity) {
      return this.update(conditions, properties);
    }

    const newEntity = this.create(properties);
    return this.save(newEntity);
  }
}
