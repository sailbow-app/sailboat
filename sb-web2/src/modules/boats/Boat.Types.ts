import { User } from 'shared/user/User';

export enum BannerType {
    Color = 'Color',
    Link = 'Link',
}

export interface BannerState {
    show?: boolean;
    type: BannerType;
    value: string;
    position?: number;
}

// move to role
export enum Role {
    Captain = 'captain',
    Assistant = 'assistant',
    Sailor = 'sailor',
}

// move to role
export enum RoleLabel {
    Captain = 'Captain',
    Assistant = 'Assistant',
    Sailor = 'Sailor',
}

export enum ModuleName {
    Date = 'date',
    Location = 'location',
}

export enum ModuleType {
    Manifest = 'manifest',
    Widget = 'widget',
}

export enum ModuleMode {
    View,
    Settings,
    Edit,
}

export interface CreateBoat extends Omit<Boat, 'id' | 'anchors'> {}

export interface Photo {
    src: string;
    width: number;
    height: number;
}

export interface Crew extends Pick<User, 'id' | 'email' | 'name'> {
    role: Role;
    info?: string;
}

export interface ModuleSettings {
    allowMultiple: boolean;
    anonymousVoting: boolean;
    [key: string]: any;
}

export type ModuleData<T> = {
    id: string;
    votes: number;
    isEditing?: boolean;
    text: string; // text to be shown in widget option and manifest
    author: Pick<User, 'id' | 'email' | 'name'>;
    selected: boolean; // if this option is selected by the current user. will have to save it differently in DB
} & T;

export interface Module<T> {
    id: string;
    name: ModuleName;
    order: number;
    description: string;
    totalVotes: number; // will need this to show percentage voted in the option
    data: ModuleData<T>[];
    settings: ModuleSettings;
    mode: ModuleMode;
    loading: boolean;
    actionRequired?: boolean;
    dataLoaded?: boolean;
    error?: any;
    finalizedOptionId?: string;
}

export interface ModuleExtended<T> {
    [key: string]: Module<T>;
}

export interface Boat {
    id: string;
    name: string;
    description?: string;
    banner: BannerState;
    crew: Crew[];
    modules: ModuleExtended<any>;
}

export interface BoatState {
    boats?: Boat[];
    activeBoat?: Boat;
    error?: any;
    loading: {
        create: boolean;
        get: boolean;
        getAll: boolean;
    };
    createOpen: boolean;
}
