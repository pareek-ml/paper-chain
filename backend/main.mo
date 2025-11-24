import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import OrderedMap "mo:base/OrderedMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import Float "mo:base/Float";
import List "mo:base/List";

import Migration "migration";

// Specify the data migration function in with-clause
(with migration = Migration.run)
actor Main {
  let storage = Storage.new();
  include MixinStorage(storage);

  // Initialize the user system state
  let accessControlState = AccessControl.initState();

  // Initialize auth (first caller becomes admin, others become users)
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    // Admin-only check happens inside
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
    reputation : Nat;
    tokenBalance : Nat;
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view profiles");
    };
    principalMap.get(userProfiles, caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own profile");
    };
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  public type Paper = {
    id : Text;
    title : Text;
    abstract : Text;
    author : Principal;
    submissionDate : Time.Time;
    fileReference : ?Storage.ExternalBlob;
    externalLink : ?Text;
    aggregateRating : Float;
    reviewCount : Nat;
    citations : [Text];
  };

  public type Review = {
    id : Text;
    paperId : Text;
    reviewer : Principal;
    rating : Nat;
    feedback : Text;
    submissionDate : Time.Time;
  };

  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  var papers = textMap.empty<Paper>();
  var reviews = textMap.empty<Review>();

  public shared ({ caller }) func submitPaper(
    id : Text,
    title : Text,
    abstract : Text,
    fileReference : ?Storage.ExternalBlob,
    externalLink : ?Text,
    citations : [Text],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can submit papers");
    };

    // Validate citations
    for (citationId in citations.vals()) {
      switch (textMap.get(papers, citationId)) {
        case (null) {
          Debug.trap("Cited paper with ID " # citationId # " does not exist");
        };
        case (?_) {
          // Check if the caller has reviewed the cited paper
          let hasReviewed = List.some<Review>(
            List.fromArray(Iter.toArray(textMap.vals(reviews))),
            func(review : Review) : Bool {
              review.paperId == citationId and review.reviewer == caller
            },
          );

          if (not hasReviewed) {
            Debug.trap("You must review paper with ID " # citationId # " before citing it");
          };
        };
      };
    };

    let paper : Paper = {
      id;
      title;
      abstract;
      author = caller;
      submissionDate = Time.now();
      fileReference;
      externalLink;
      aggregateRating = 0.0;
      reviewCount = 0;
      citations;
    };

    papers := textMap.put(papers, id, paper);

    // Award tokens for paper submission
    switch (principalMap.get(userProfiles, caller)) {
      case (null) {
        // Create new profile with token reward
        let newProfile : UserProfile = {
          name = "";
          reputation = 0;
          tokenBalance = 10;
        };
        userProfiles := principalMap.put(userProfiles, caller, newProfile);
      };
      case (?profile) {
        let updatedProfile : UserProfile = {
          name = profile.name;
          reputation = profile.reputation;
          tokenBalance = profile.tokenBalance + 10;
        };
        userProfiles := principalMap.put(userProfiles, caller, updatedProfile);
      };
    };
  };

  public query func getAllPapers() : async [Paper] {
    // Public access - anyone including guests can view papers
    Iter.toArray(textMap.vals(papers));
  };

  public query func getPaper(id : Text) : async ?Paper {
    // Public access - anyone including guests can view a paper
    textMap.get(papers, id);
  };

  public shared ({ caller }) func submitReview(
    id : Text,
    paperId : Text,
    rating : Nat,
    feedback : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can submit reviews");
    };

    switch (textMap.get(papers, paperId)) {
      case (null) { Debug.trap("Paper not found") };
      case (?paper) {
        // Prevent self-review
        if (paper.author == caller) {
          Debug.trap("Cannot review your own paper");
        };

        let review : Review = {
          id;
          paperId;
          reviewer = caller;
          rating;
          feedback;
          submissionDate = Time.now();
        };

        reviews := textMap.put(reviews, id, review);

        let newReviewCount = paper.reviewCount + 1;
        let newAggregateRating = ((paper.aggregateRating * Float.fromInt(paper.reviewCount)) + Float.fromInt(rating)) / Float.fromInt(newReviewCount);

        let updatedPaper : Paper = {
          id = paper.id;
          title = paper.title;
          abstract = paper.abstract;
          author = paper.author;
          submissionDate = paper.submissionDate;
          fileReference = paper.fileReference;
          externalLink = paper.externalLink;
          aggregateRating = newAggregateRating;
          reviewCount = newReviewCount;
          citations = paper.citations;
        };

        papers := textMap.put(papers, paperId, updatedPaper);

        // Award tokens for review submission
        switch (principalMap.get(userProfiles, caller)) {
          case (null) {
            // Create new profile with token reward
            let newProfile : UserProfile = {
              name = "";
              reputation = 1;
              tokenBalance = 5;
            };
            userProfiles := principalMap.put(userProfiles, caller, newProfile);
          };
          case (?profile) {
            let updatedProfile : UserProfile = {
              name = profile.name;
              reputation = profile.reputation + 1;
              tokenBalance = profile.tokenBalance + 5;
            };
            userProfiles := principalMap.put(userProfiles, caller, updatedProfile);
          };
        };
      };
    };
  };

  public query func getReviewsForPaper(paperId : Text) : async [Review] {
    // Public access - anyone including guests can view reviews
    Iter.toArray(
      Iter.filter(
        textMap.vals(reviews),
        func(review : Review) : Bool {
          review.paperId == paperId;
        },
      )
    );
  };

  public query ({ caller }) func getUserTokenBalance() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view token balances");
    };
    // Users can only view their own token balance
    switch (principalMap.get(userProfiles, caller)) {
      case (null) { 0 };
      case (?profile) { profile.tokenBalance };
    };
  };
};

