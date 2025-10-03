import { CreateLiveStreamDto } from '../dtos/create-live-stream.dto';

export interface LiveStreamProvider {
  getLiveStreams(
    params: LiveStreamProviderParams[],
  ): Promise<CreateLiveStreamDto[]>;
}

export type LiveStreamProviderParams = {
  username?: string;
  url?: string;
  pageId: number;
};
