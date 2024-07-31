import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface PlanProps {
  name: string
  duration: number
  price: number // in cents
  discount: number | null
  gymId: UniqueEntityID
}

export class Plan extends Entity<PlanProps> {
  get name() {
    return this.props.name
  }

  get duration() {
    return this.props.duration
  }

  set duration(duration: number) {
    this.props.duration = duration
  }

  get price() {
    return this.props.price
  }

  set price(price: number) {
    this.props.price = price
  }

  get discount() {
    return this.props.discount
  }

  set discount(discount: number | null) {
    this.props.discount = discount
  }

  get gymId() {
    return this.props.gymId
  }

  static create(props: PlanProps, id?: UniqueEntityID) {
    return new Plan(props, id)
  }
}
