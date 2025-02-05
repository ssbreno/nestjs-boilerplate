import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { LoggingInterceptor } from './common/logging/logging.interceptor'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { LoggingModule } from './common/logging'
import { HealthModule } from './health/health.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { CustomThrottlerGuard } from './common/guards/throttler.guard'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot(),
    LoggingModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
