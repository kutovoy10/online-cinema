import { applyDecorators, UseGuards } from '@nestjs/common'

import { TypeRole } from '@src/auth/auth.interface'
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard'
import { OnlyAdminGuard } from '@src/auth/guards/admin.guard'

export const Auth = (role: TypeRole = 'user') =>
  applyDecorators(
    role === 'admin'
      ? UseGuards(JwtAuthGuard, OnlyAdminGuard)
      : UseGuards(JwtAuthGuard)
  )
