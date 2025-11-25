export const idlFactory = ({ IDL }) => {
  const UserRole = IDL.Variant({
    'admin' : IDL.Null,
    'user' : IDL.Null,
    'guest' : IDL.Null,
  });
  const Time = IDL.Int;
  const ExternalBlob = IDL.Record({
    'id' : IDL.Text,
    'size' : IDL.Nat,
    'mimeType' : IDL.Text,
    'filename' : IDL.Text,
  });
  const Paper = IDL.Record({
    'id' : IDL.Text,
    'title' : IDL.Text,
    'externalLink' : IDL.Opt(IDL.Text),
    'author' : IDL.Principal,
    'aggregateRating' : IDL.Float64,
    'submissionDate' : Time,
    'abstract' : IDL.Text,
    'citations' : IDL.Vec(IDL.Text),
    'reviewCount' : IDL.Nat,
    'fileReference' : IDL.Opt(ExternalBlob),
  });
  const UserProfile = IDL.Record({
    'name' : IDL.Text,
    'reputation' : IDL.Nat,
    'tokenBalance' : IDL.Nat,
  });
  const Review = IDL.Record({
    'id' : IDL.Text,
    'feedback' : IDL.Text,
    'submissionDate' : Time,
    'paperId' : IDL.Text,
    'rating' : IDL.Nat,
    'reviewer' : IDL.Principal,
  });
  return IDL.Service({
    'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
    'getAllPapers' : IDL.Func([], [IDL.Vec(Paper)], ['query']),
    'getCallerUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
    'getPaper' : IDL.Func([IDL.Text], [IDL.Opt(Paper)], ['query']),
    'getReviewsForPaper' : IDL.Func([IDL.Text], [IDL.Vec(Review)], ['query']),
    'getUserProfile' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(UserProfile)],
        ['query'],
      ),
    'getUserTokenBalance' : IDL.Func([], [IDL.Nat], ['query']),
    'initializeAccessControl' : IDL.Func([], [], []),
    'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'saveCallerUserProfile' : IDL.Func([UserProfile], [], []),
    'submitPaper' : IDL.Func(
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
    'submitReview' : IDL.Func([IDL.Text, IDL.Text, IDL.Nat, IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
