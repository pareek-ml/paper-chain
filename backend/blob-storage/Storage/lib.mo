// backend/blob-storage/Storage/lib.mo
import Principal "mo:base/Principal";
import Mixin "../Mixin/lib";

module {
  // Minimal stub state so code can compile.
  public type State = {};

  // Re-export the ExternalBlob type that Mixin defines,
  // because migration.mo expects Storage.ExternalBlob.
  public type ExternalBlob = Mixin.ExternalBlob;

  // Constructor expected by main.mo: e.g. `let storage = Storage.new();`
  public func new() : State {
    {}
  };

  // Minimal stub authorization check.
  public func isAuthorized(_state : State, _caller : Principal) : Bool {
    true;
  };
};