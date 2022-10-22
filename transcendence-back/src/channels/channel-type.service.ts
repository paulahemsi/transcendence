import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelType, channelType } from 'src/entity/channel-type.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ChannelTypeService {
  constructor(
    @InjectRepository(ChannelType)
    private readonly channelTypeRepository: Repository<ChannelType>,
    private dataSource: DataSource,
  ) {
    this.addChannelTypes();
  }

  private async addChannelTypes() {
    const publicType = this.createChannelTypeEntity(channelType.PUBLIC);
    const privateType = this.createChannelTypeEntity(channelType.PRIVATE);
    const protectedType = this.createChannelTypeEntity(channelType.PROTECTED);
    const directMessageType = this.createChannelTypeEntity(
      channelType.DIRECT_MESSAGES,
    );

    const queryRunner = await this.createTransaction();
    try {
      await queryRunner.manager.save(await publicType);
      await queryRunner.manager.save(await privateType);
      await queryRunner.manager.save(await protectedType);
      await queryRunner.manager.save(await directMessageType);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getChannelType(channelType: channelType) {
    return this.channelTypeRepository.findOneBy({ type: channelType });
  }

  private async createChannelTypeEntity(type: channelType) {
    return this.channelTypeRepository.create({
      type: type,
    });
  }

  private async createTransaction() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }
}
