import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type ScheduleId = bigint;
export type ShowId = string;
export interface Show {
    id: ShowId;
    title: string;
    description: string;
    image: ExternalBlob;
}
export interface Schedule {
    id: ScheduleId;
    startTime: bigint;
    showId: ShowId;
    endTime: bigint;
    dayOfWeek: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addSchedule(showId: ShowId, startTime: bigint, endTime: bigint, dayOfWeek: string): Promise<void>;
    addShow(id: ShowId, title: string, description: string, image: ExternalBlob): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteSchedule(id: ScheduleId): Promise<void>;
    deleteShow(id: ShowId): Promise<void>;
    editSchedule(id: ScheduleId, showId: ShowId, startTime: bigint, endTime: bigint, dayOfWeek: string): Promise<void>;
    editShow(id: ShowId, title: string, description: string, image: ExternalBlob): Promise<void>;
    getAllSchedules(): Promise<Array<Schedule>>;
    getAllShows(): Promise<Array<Show>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSchedulesByDay(dayOfWeek: string): Promise<Array<Schedule>>;
    getSchedulesByShow(showId: ShowId): Promise<Array<Schedule>>;
    getShow(id: ShowId): Promise<Show>;
    getUpcomingSchedules(currentTime: bigint): Promise<Array<Schedule>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
