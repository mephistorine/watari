import { TransactionType } from "./transaction-type"

export class Transaction {
  public id!: string
  public userId!: string
  public categoryId: string | null = null
  public type!: TransactionType
  public amount!: number
  public description!: string | null
  public createTime!: string
}
