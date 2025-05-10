export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
    OWNER = 'OWNER',
    GUEST = 'GUEST'
}

export class User {
    _id: string;
    name: string;
    email: string;
    googleId: string;
    avatar?: string;
    role: Role;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;

    constructor() {
        this._id = '';
        this.name = '';
        this.email = '';
        this.googleId = '';
        this.role = Role.USER;
        this.lastLoginAt = new Date();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}