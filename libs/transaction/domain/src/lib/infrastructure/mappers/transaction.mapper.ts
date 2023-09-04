import { Mapper } from "@watari/shared/util-domain"

import { TransactionProps } from "../../entities/transaction.props"
import { Transaction } from "../../entities/transaction.entity"

export class TransactionMapper implements Mapper<TransactionProps, Transaction> {
  public mapFrom(entity: Transaction): TransactionProps {
    return {
      id: entity.id,
      user_id: entity.userId,
      create_time: entity.createTime,
      type: entity.type,
      amount: entity.amount,
      description: entity.description,
      category_id: entity.categoryId
    }
  }

  public mapTo(props: TransactionProps): Transaction {
    const transaction: Transaction = new Transaction()
    transaction.id = props.id
    transaction.amount = props.amount
    transaction.createTime = props.create_time
    transaction.type = props.type
    transaction.userId = props.user_id
    transaction.categoryId = props.category_id
    transaction.description = props.description
    return transaction
  }
}
