import { Document } from 'mongoose';
import { ChallengeStatus } from '../enums/challenges.enum';

export interface ChallengesInterface extends Document {
  DateTimeChallenge: Date;
  status: ChallengeStatus;
  DateTimeRequest: Date;
  DateTimeResponse?: Date;
  requester: string;
  category: string;
  match?: string;
  players: string[];
}
