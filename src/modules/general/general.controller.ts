import { HttpService } from '@nestjs/axios';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';
import { ResponseUtil } from 'src/utils/response.utils';

@ApiTags('General')
@Controller('general')
export class GeneralController {
  constructor(private readonly httpService: HttpService) {}

  // @UseGuards(AuthGuard('jwt')) // Uncomment if you want to apply JWT authentication guard
  @Get('applications')
  async getApplication(@Request() req) {
    try {
      // Fetch the response from the external API
      const response = await lastValueFrom(this.httpService.get(process.env.APPLICATION_API));
      // Return the data in a structured format using ResponseUtil.success()
      return ResponseUtil.success(response.data); // Only return the response data (not the full response object)
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Optionally, handle the error more gracefully by throwing a custom exception or returning a proper error response
      throw error;
    }
  }
}
