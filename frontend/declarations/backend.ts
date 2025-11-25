import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';

// Type definitions
export interface ExternalBlob {
  'id': string,
  'size': bigint,
  'mimeType': string,
  'filename': string,
}
export interface Paper {
  'id': string,
  'title': string,
  'externalLink': [] | [string],
  'author': Principal,
  'aggregateRating': number,
  'submissionDate': Time,
  'abstract': string,
  'citations': Array<string>,
  'reviewCount': bigint,
  'fileReference': [] | [ExternalBlob],
}
export interface Review {
  'id': string,
  'feedback': string,
  'submissionDate': Time,
  'paperId': string,
  'rating': bigint,
  'reviewer': Principal,
}
export type Time = bigint;
export interface UserProfile {
  'name': string,
  'reputation': bigint,
  'tokenBalance': bigint,
}
export type UserRole = { 'admin': null } |
{ 'user': null } |
{ 'guest': null };
export interface _SERVICE {
  'assignCallerUserRole': ActorMethod<[Principal, UserRole], undefined>,
  'getAllPapers': ActorMethod<[], Array<Paper>>,
  'getCallerUserProfile': ActorMethod<[], [] | [UserProfile]>,
  'getCallerUserRole': ActorMethod<[], UserRole>,
  'getPaper': ActorMethod<[string], [] | [Paper]>,
  'getReviewsForPaper': ActorMethod<[string], Array<Review>>,
  'getUserProfile': ActorMethod<[Principal], [] | [UserProfile]>,
  'getUserTokenBalance': ActorMethod<[], bigint>,
  'initializeAccessControl': ActorMethod<[], undefined>,
  'isCallerAdmin': ActorMethod<[], boolean>,
  'saveCallerUserProfile': ActorMethod<[UserProfile], undefined>,
  'submitPaper': ActorMethod<
    [string, string, string, [] | [ExternalBlob], [] | [string], Array<string>],
    undefined
  >,
  'submitReview': ActorMethod<[string, string, bigint, string], undefined>,
}

// DFX will normally pass in an { IDL } object; we don't care right now.
// Returning an empty service is enough to satisfy the Agent.
export const idlFactory = (_: any) => ({ _fields: [] } as any);