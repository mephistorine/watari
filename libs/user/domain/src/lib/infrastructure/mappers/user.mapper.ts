import { Mapper } from "@watari/shared/util-domain"

import { UserProps } from "../../entities/user.props"
import { User } from "../../entities/user.entity"

export class UserMapper implements Mapper<UserProps, User> {
  public mapTo(userProps: UserProps): User {
    const user: User = new User()

    user.id = userProps.id
    user.name = userProps.name
    user.createTime = userProps.create_time

    return user
  }

  public mapFrom(entity: User): UserProps {
    return {
      id: entity.id,
      name: entity.name,
      create_time: entity.createTime
    }
  }
}
