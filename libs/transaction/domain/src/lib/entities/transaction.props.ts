import { TransactionType } from "./transaction-type"

export type TransactionProps = {
  id: string
  create_time: string
  type: TransactionType
  amount: number
  user_id: string
  category_id: string | null
  description: string | null
}
