import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamMember {
  name: string;
  email: string;
  role?: string;
}

export interface ITeam extends Document {
  teamId: string;
  teamName: string;
  teamLeaderName: string;
  teamLeaderEmail: string;
  teamMembers: ITeamMember[];
  idCardPath: string | null;
  idCardVerified: boolean;
  recaptchaVerified: boolean;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: '' },
});

const TeamSchema = new Schema<ITeam>(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    teamLeaderName: {
      type: String,
      required: true,
      trim: true,
    },
    teamLeaderEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    teamMembers: {
      type: [TeamMemberSchema],
      default: [],
    },
    idCardPath: {
      type: String,
      default: null,
    },
    idCardVerified: {
      type: Boolean,
      default: false,
    },
    recaptchaVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
TeamSchema.index({ teamLeaderEmail: 1 });
TeamSchema.index({ createdAt: -1 });

// Virtual for member count
TeamSchema.virtual('memberCount').get(function () {
  return this.teamMembers.length;
});

// Method to get public data (without sensitive info)
TeamSchema.methods.toPublicJSON = function () {
  return {
    teamId: this.teamId,
    teamName: this.teamName,
    teamLeaderName: this.teamLeaderName,
    teamLeaderEmail: this.teamLeaderEmail,
    teamMembers: this.teamMembers,
    status: this.status,
    createdAt: this.createdAt,
  };
};

export const Team = mongoose.model<ITeam>('Team', TeamSchema);
export default Team;
