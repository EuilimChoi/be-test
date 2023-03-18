import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IGetReservationsRepository } from '../interfaces/i-get-reservations.repository';
import { Reservation } from '../../entities/reservation.entity';

@Injectable()
export class GetReservationsRepository implements IGetReservationsRepository {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async execute(userId: string): Promise<Reservation[]> {
    const reservations = await this.reservationRepository.find({
      where: { userId },
      relations: { house: { images: true } },
    });
    return reservations;
  }
}