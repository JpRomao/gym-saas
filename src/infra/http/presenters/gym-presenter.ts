import { Gym } from '@/domain/gym/enterprise/entities/gym'

export class GymPresenter {
  static toHTTP(gym: Gym) {
    return {
      id: gym.id.toString(),
      ownerId: gym.ownerId.toString(),
      email: gym.email,
      name: gym.name,
      cnpj: gym.cnpj,
      phone: gym.phone,
      lastPaymentDate: gym.lastPaymentDate,
      premiumEndsAt: gym.premiumEndsAt,
      createdAt: gym.createdAt,
    }
  }
}
