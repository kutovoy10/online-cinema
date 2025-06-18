import { Reflector } from '@nestjs/core'
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'

import { UserModel } from '@src/user/user.model'

export class OnlyAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: UserModel }>()
    const user = request.user

    if (!user.isAdmin) {
      throw new ForbiddenException(
        'You do not have permission to access this resource.'
      )
    }

    return user.isAdmin
  }
}
