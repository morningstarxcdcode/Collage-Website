import { Controller, Get, Query, Res, Logger } from '@nestjs/common';
import { DigilockerService } from './digilocker.service';
import type { Response } from 'express';

@Controller('digilocker')
export class DigilockerController {
  private readonly logger = new Logger(DigilockerController.name);

  constructor(private readonly digilockerService: DigilockerService) {}

  @Get('connect')
  connect(@Res() res: Response) {
    const url = this.digilockerService.getAuthUrl();
    return res.redirect(url);
  }

  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('state') _state: string,
    @Res() res: Response,
  ) {
    // _state is prefixed to indicate intentionally unused (would be validated in production)

    try {
      const tokenData = await this.digilockerService.getAccessToken(code);
      const accessToken = tokenData.access_token;

      const userDetails =
        await this.digilockerService.getUserDetails(accessToken);
      this.logger.log(`DigiLocker User Linked: ${userDetails.digilockerid}`);

      return res.redirect(
        'http://localhost:3000/dashboard?digilocker=connected',
      );
    } catch (error) {
      this.logger.error('DigiLocker Callback Failed', error);
      return res.redirect('http://localhost:3000/dashboard?digilocker=failed');
    }
  }
}
