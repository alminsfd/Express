export interface IUser {
     name: string,
     email: string,
     password: string,
     age: number,
     role?: "admin" | 'manager' | 'user',
     is_active?: boolean
}