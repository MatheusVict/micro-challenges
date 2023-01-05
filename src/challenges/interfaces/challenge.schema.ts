import * as mongoose from 'mongoose';

export const ChallengeSchema = new mongoose.Schema(
  {
    DateTimeChallenge: { type: Date },
    status: { type: String },
    DateTimeRequest: { type: Date },
    DateTimeResponse: { type: Date },
    requester: { type: mongoose.Schema.Types.ObjectId },
    category: { type: mongoose.Schema.Types.ObjectId },
    players: [{ type: mongoose.Schema.Types.ObjectId }],
    match: { type: mongoose.Schema.Types.ObjectId, ref: 'match' },
  },
  { timestamps: true, collection: 'challenges' },
);
