import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ICreateHouseService } from '../interfaces';
import { CreateHouseService } from '../services';
import { CreateHouseReqDto, CreateHouseResDto } from '../dtos';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/houses')
export class CreateHouseController {
  constructor(
    @Inject(CreateHouseService)
    private createHouseService: ICreateHouseService,
  ) {}

  @ApiOperation({ summary: '숙소 등록' })
  @ApiResponse({
    status: 201,
    description: '숙소 등록 성공',
    type: CreateHouseResDto,
  })
  @ApiTags('House')
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createHouse(
    @Body() createHouseReqDto: CreateHouseReqDto,
  ): Promise<CreateHouseResDto> {
    return this.createHouseService.execute(createHouseReqDto);
  }
}
