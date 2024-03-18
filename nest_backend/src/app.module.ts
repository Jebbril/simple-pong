import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { MatchHistoryModule } from './match-history/match-history.module';

@Module({
  imports: [GameModule, MatchHistoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
