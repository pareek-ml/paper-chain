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

// IDL Factory
export const idlFactory = ({ IDL }: { IDL: any }) => {
  const UserRole = IDL.Variant({
    'admin': IDL.Null,
    'user': IDL.Null,
    'guest': IDL.Null,
  });
  const Time = IDL.Int;
  const ExternalBlob = IDL.Record({
    'id': IDL.Text,
    'size': IDL.Nat,
    'mimeType': IDL.Text,
    'filename': IDL.Text,
  });
  const Paper = IDL.Record({
    'id': IDL.Text,
    'title': IDL.Text,
    'externalLink': IDL.Opt(IDL.Text),
    'author': IDL.Principal,
    'aggregateRating': IDL.Float64,
    'submissionDate': Time,
    'abstract': IDL.Text,
    'citations': IDL.Vec(IDL.Text),
    'reviewCount': IDL.Nat,
    'fileReference': IDL.Opt(ExternalBlob),
  });
  const UserProfile = IDL.Record({
    'name': IDL.Text,
    'reputation': IDL.Nat,
    'tokenBalance': IDL.Nat,
  });
  const Review = IDL.Record({
    'id': IDL.Text,
    'feedback': IDL.Text,
    'submissionDate': Time,
    'paperId': IDL.Text,
    'rating': IDL.Nat,
    'reviewer': IDL.Principal,
  });
  return IDL.Service({
    'assignCallerUserRole': IDL.Func([IDL.Principal, UserRole], [], []),
    'getAllPapers': IDL.Func([], [IDL.Vec(Paper)], ['query']),
    'getCallerUserProfile': IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    'getCallerUserRole': IDL.Func([], [UserRole], ['query']),
    'getPaper': IDL.Func([IDL.Text], [IDL.Opt(Paper)], ['query']),
    'getReviewsForPaper': IDL.Func([IDL.Text], [IDL.Vec(Review)], ['query']),
    'getUserProfile': IDL.Func(
      [IDL.Principal],
      [IDL.Opt(UserProfile)],
      ['query'],
    ),
    'getUserTokenBalance': IDL.Func([], [IDL.Nat], ['query']),
    'initializeAccessControl': IDL.Func([], [], []),
    'isCallerAdmin': IDL.Func([], [IDL.Bool], ['query']),
    'saveCallerUserProfile': IDL.Func([UserProfile], [], []),
    'submitPaper': IDL.Func(
      [
        IDL.Text,
        IDL.Text,
        IDL.Text,
        IDL.Opt(ExternalBlob),
        IDL.Opt(IDL.Text),
        IDL.Vec(IDL.Text),
      ],
      [],
      [],
    ),
    'submitReview': IDL.Func([IDL.Text, IDL.Text, IDL.Nat, IDL.Text], [], []),
  });
};

export const canisterId = "uxrrr-q7777-77774-qaaaq-cai";