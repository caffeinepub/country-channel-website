import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type Show = {
    id : Text;
    title : Text;
    description : Text;
    image : Storage.ExternalBlob;
  };

  type Schedule = {
    id : Nat;
    showId : Text;
    startTime : Int;
    endTime : Int;
    dayOfWeek : Text;
  };

  type UserProfile = {
    name : Text;
  };

  type Actor = {
    nextScheduleId : Nat;
    shows : Map.Map<Text, Show>;
    schedules : Map.Map<Nat, Schedule>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : Actor) : Actor {
    old;
  };
};
