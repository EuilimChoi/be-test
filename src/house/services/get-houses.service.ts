import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  GetHousesServiceInputDto,
  GetHousesServiceOutputDto,
  IGetHouseTotalCountRepository,
  IGetHousesRepository,
} from '../interfaces';
import { map, toArray } from '@fxts/core';
import {
  GetHouseTotalCountRepository,
  GetHousesRepository,
} from '../repositories';

@Injectable()
export class GetHousesService {
  constructor(
    @Inject(GetHouseTotalCountRepository)
    private getHouseTotalCountRepository: IGetHouseTotalCountRepository,
    @Inject(GetHousesRepository)
    private getHousesRepository: IGetHousesRepository,
  ) {}

  async execute(
    params: GetHousesServiceInputDto,
  ): Promise<GetHousesServiceOutputDto> {
    const totalCount = await this.getHouseTotalCountRepository.execute();
    const lastPage = Math.floor(totalCount / params.getLimit());
    if (params.getPage() > lastPage) {
      throw new BadRequestException('비정상적인 요청');
    }
    const houses = await this.getHousesRepository.execute({
      limit: params.getLimit(),
      order: params.getOrder(),
      skip: params.getSkip(),
      sortBy: params.getSortBy(),
    });

    return {
      houses: toArray(map((house) => house.getInfoForList(), houses)),
      paginationInfo: {
        currentPage: params.getPage(),
        hasNextPage: params.getPage() < lastPage,
        hasPreviousPage: params.getPage() > 1,
      },
    };
  }
}