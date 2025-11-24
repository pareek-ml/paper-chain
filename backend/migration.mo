import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Float "mo:base/Float";
import Time "mo:base/Time";
import Storage "blob-storage/Storage";

module {
  // Old types
  type OldPaper = {
    id : Text;
    title : Text;
    abstract : Text;
    author : Principal;
    submissionDate : Time.Time;
    fileReference : ?Storage.ExternalBlob;
    externalLink : ?Text;
    aggregateRating : Float;
    reviewCount : Nat;
  };

  type OldActor = {
    papers : OrderedMap.Map<Text, OldPaper>;
  };

  // New types
  type NewPaper = {
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

  type NewActor = {
    papers : OrderedMap.Map<Text, NewPaper>;
  };

  public func run(old : OldActor) : NewActor {
    let textMap = OrderedMap.Make<Text>(Text.compare);
    let papers = textMap.map<OldPaper, NewPaper>(
      old.papers,
      func(_id, oldPaper) {
        {
          id = oldPaper.id;
          title = oldPaper.title;
          abstract = oldPaper.abstract;
          author = oldPaper.author;
          submissionDate = oldPaper.submissionDate;
          fileReference = oldPaper.fileReference;
          externalLink = oldPaper.externalLink;
          aggregateRating = oldPaper.aggregateRating;
          reviewCount = oldPaper.reviewCount;
          citations = [];
        };
      },
    );
    { papers };
  };
};

