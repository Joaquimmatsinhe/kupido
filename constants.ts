import { Gender, ReportReason } from './types';

export const LOCATIONS: string[] = [
  'Maputo',
  'Matola',
  'Xai-Xai',
  'Inhambane',
  'Maxixe',
  'Beira',
  'Dondo',
  'Chimoio',
  'Tete',
  'Moatize',
  'Quelimane',
  'Mocuba',
  'Nampula',
  'Nacala',
  'Pemba',
  'Lichinga',
];

export const INTERESTS: string[] = [
  'Música',
  'Futebol',
  'Praia',
  'Culinária',
  'Literatura',
  'Dança',
  'Netflix',
  'Viagens',
  'Cinema',
  'Arte',
  'Tecnologia',
  'Fotografia',
];

export const GENDERS: Gender[] = [
  Gender.Male,
  Gender.Female,
  Gender.NonBinary,
  Gender.PreferNotToSay,
];

export const REPORT_REASONS: ReportReason[] = [
    ReportReason.INAPPROPRIATE_BEHAVIOR,
    ReportReason.SPAM,
    ReportReason.FAKE_PROFILE,
    ReportReason.INAPPROPRIATE_CONTENT,
];
