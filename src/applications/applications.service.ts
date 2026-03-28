import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus, FINAL_STATUSES } from './entities/application.entity';
import {
  CreateApplicationDto,
  UpdateApplicationDto,
  ChangeStatusDto,
  FindApplicationsDto,
} from './dto/application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly repo: Repository<Application>,
  ) {}

  async create(dto: CreateApplicationDto): Promise<Application> {
    const existing = await this.repo.findOne({ where: { phone: dto.phone } });
    if (existing) {
      throw new ConflictException('Заявка с таким номером телефона уже существует');
    }

    const application = this.repo.create(dto);
    return this.repo.save(application);
  }

  async findAll(query: FindApplicationsDto) {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = 'createdAt',
      order = 'DESC',
    } = query;

    const qb = this.repo.createQueryBuilder('app');

    if (status) {
      qb.andWhere('app.status = :status', { status });
    }

    if (search) {
      qb.andWhere('(app.name ILIKE :search OR app.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const allowedSortFields = ['createdAt', 'updatedAt', 'name', 'status'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    qb.orderBy(`app.${sortField}`, order);
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Application> {
    const application = await this.repo.findOne({ where: { id } });
    if (!application) {
      throw new NotFoundException(`Заявка #${id} не найдена`);
    }
    return application;
  }

  async update(id: number, dto: UpdateApplicationDto): Promise<Application> {
    const application = await this.findOne(id);
    Object.assign(application, dto);
    return this.repo.save(application);
  }

  async changeStatus(id: number, dto: ChangeStatusDto): Promise<Application> {
    const application = await this.findOne(id);

    if (FINAL_STATUSES.includes(application.status)) {
      throw new BadRequestException(
        `Нельзя изменить состояние заявки со статусом "${application.status}"`,
      );
    }

    if (application.status === dto.status) {
      throw new BadRequestException('Новый статус совпадает с текущим');
    }

    application.status = dto.status;
    return this.repo.save(application);
  }
}
