import {z} from "zod";

export const UserSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
});

export const SigninUserSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const RoomSchema = z.object({
    name: z.string()
});


// export type User = z.infer<typeof UserSchema>;
// export type SigninUser = z.infer<typeof SigninUserSchema>;
// export type Room = z.infer<typeof RoomSchema>;
