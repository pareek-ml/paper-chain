// backend/blob-storage/Mixin/lib.mo
import Nat "mo:base/Nat";
import Text "mo:base/Text";

module {
  public type ExternalBlob = {
    id : Text;
    filename : Text;
    mimeType : Text;
    size : Nat;
  };
};