import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type ShowId = Text;
  type ScheduleId = Nat;

  type Show = {
    id : ShowId;
    title : Text;
    description : Text;
    image : Storage.ExternalBlob;
  };

  type Schedule = {
    id : ScheduleId;
    showId : ShowId;
    startTime : Int;
    endTime : Int;
    dayOfWeek : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  module Schedule {
    public func compareByStartTime(a : Schedule, b : Schedule) : Order.Order {
      Int.compare(a.startTime, b.startTime);
    };
  };

  var nextScheduleId = 0;
  let shows = Map.empty<ShowId, Show>();
  let schedules = Map.empty<ScheduleId, Schedule>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Shows management
  public shared ({ caller }) func addShow(id : ShowId, title : Text, description : Text, image : Storage.ExternalBlob) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add shows");
    };
    if (shows.containsKey(id)) { Runtime.trap("Show with this ID already exists!") };
    let newShow : Show = {
      id;
      title;
      description;
      image;
    };
    shows.add(id, newShow);
  };

  public shared ({ caller }) func editShow(id : ShowId, title : Text, description : Text, image : Storage.ExternalBlob) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can edit shows");
    };
    switch (shows.get(id)) {
      case (null) { Runtime.trap("Show does not exist") };
      case (?_) {
        let updatedShow : Show = {
          id;
          title;
          description;
          image;
        };
        shows.add(id, updatedShow);
      };
    };
  };

  public shared ({ caller }) func deleteShow(id : ShowId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete shows");
    };
    shows.remove(id);
  };

  public query ({ caller }) func getAllShows() : async [Show] {
    shows.values().toArray();
  };

  public query ({ caller }) func getShow(id : ShowId) : async Show {
    switch (shows.get(id)) {
      case (null) { Runtime.trap("Show does not exist") };
      case (?show) { show };
    };
  };

  // Schedule management
  public shared ({ caller }) func addSchedule(showId : ShowId, startTime : Int, endTime : Int, dayOfWeek : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add schedules");
    };
    if (not shows.containsKey(showId)) { Runtime.trap("Show does not exist") };
    let newSchedule : Schedule = {
      id = nextScheduleId;
      showId;
      startTime;
      endTime;
      dayOfWeek;
    };
    schedules.add(nextScheduleId, newSchedule);
    nextScheduleId += 1;
  };

  public shared ({ caller }) func editSchedule(id : ScheduleId, showId : ShowId, startTime : Int, endTime : Int, dayOfWeek : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can edit schedules");
    };
    if (not shows.containsKey(showId)) { Runtime.trap("Show does not exist") };
    switch (schedules.get(id)) {
      case (null) { Runtime.trap("Schedule does not exist") };
      case (?_) {
        let updatedSchedule : Schedule = {
          id;
          showId;
          startTime;
          endTime;
          dayOfWeek;
        };
        schedules.add(id, updatedSchedule);
      };
    };
  };

  public shared ({ caller }) func deleteSchedule(id : ScheduleId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete schedules");
    };
    schedules.remove(id);
  };

  public query ({ caller }) func getAllSchedules() : async [Schedule] {
    schedules.values().toArray();
  };

  public query ({ caller }) func getSchedulesByDay(dayOfWeek : Text) : async [Schedule] {
    schedules.values().toArray().filter(
      func(schedule) { Text.equal(schedule.dayOfWeek, dayOfWeek) }
    );
  };

  public query ({ caller }) func getSchedulesByShow(showId : ShowId) : async [Schedule] {
    schedules.values().toArray().filter(
      func(schedule) { schedule.showId == showId }
    );
  };

  public query ({ caller }) func getUpcomingSchedules(currentTime : Int) : async [Schedule] {
    let filtered = schedules.values().toArray().filter(
      func(schedule) { schedule.startTime >= currentTime }
    );
    filtered.sort(Schedule.compareByStartTime);
  };
};
