import {z} from "zod";

export const UserSchema = z.object({
    userName: z.string().min(3).max(20),
    password: z.string(),
    name: z.string(),
});

export const SigninUserSchema = z.object({
    userName: z.string().min(3).max(20),
    password: z.string(),
});

export const RoomSchema = z.object({
    name: z.string().min(3).max(20),
    
});

// export type User = z.infer<typeof UserSchema>;
// export type SigninUser = z.infer<typeof SigninUserSchema>;
// export type Room = z.infer<typeof RoomSchema>;
