import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { getAxiosMessage } from 'src/shared/utils/errors';

export interface RumbleLivestream {
  id: string;
  title: string;
  is_live: boolean;
  watching_now: number;
}

@Injectable()
export class RumbleService {
  private logger = new Logger(RumbleService.name);
  constructor(private http: HttpService) {}

  async getLiveStreams(url?: string) {
    if (!url) throw new BadRequestException('URL is required');

    try {
      const { data } = await this.http.axiosRef.get<{
        livestreams?: RumbleLivestream[];
      }>(url);

      const livestreams = data.livestreams;
      if (livestreams?.length) return livestreams;
      return [];
    } catch (error) {
      throw new InternalServerErrorException(
        `Error getting list of livestreams from rumble. ${getAxiosMessage(error)}`,
      );
    }
  }
}
