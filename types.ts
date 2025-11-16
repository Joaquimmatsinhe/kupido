export enum Gender {
  Male = 'Masculino',
  Female = 'Feminino',
  NonBinary = 'Não-binário',
  PreferNotToSay = 'Prefiro não dizer',
}

export enum VerificationStatus {
  Verified = 'Verificado',
  Pending = 'Pendente',
  NotVerified = 'Não Verificado',
}

export interface UserProfile {
  id: string;
  name: string;
  dateOfBirth: string; // Changed from age
  gender: Gender;
  location: string;
  email: string;
  password?: string; // For auth simulation
  photos: string[];
  bio: string;
  occupation: string;
  interests: string[];
  preferences: {
    minAge: number;
    maxAge: number;
    genders: Gender[];
    maxDistance: number;
  };
  likesYou?: boolean;
  hasSuperLikedYou?: boolean;
  registrationDate: string; // ISO String
  verificationStatus: VerificationStatus;
  isAdmin?: boolean;
}

export interface Message {
  id: string;
  text: string;
  senderId: string; // 'current-user' ou o ID do match
  timestamp: Date;
}

export enum NotificationType {
  NEW_MATCH = 'NEW_MATCH',
  NEW_MESSAGE = 'NEW_MESSAGE',
  NEW_LIKE = 'NEW_LIKE',
  SUPER_LIKE = 'SUPER_LIKE',
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  user?: UserProfile;
  read: boolean;
  timestamp: Date;
}

export enum ReportReason {
    INAPPROPRIATE_BEHAVIOR = 'Comportamento Inadequado',
    SPAM = 'Spam ou Publicidade',
    FAKE_PROFILE = 'Perfil Falso',
    INAPPROPRIATE_CONTENT = 'Conteúdo Impróprio',
}

export interface NotificationSettings {
  newMatches: boolean;
  newMessages: boolean;
  newLikes: boolean;
  superLikes: boolean;
}

export interface PrivacySettings {
  isProfileVisible: boolean;
}