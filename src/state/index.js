import { atom, useAtom } from 'jotai';

export const accessTokenAtom = atom("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");


export const useAccessToken = () => useAtom(accessTokenAtom);

export const User = atom ({})

export const getUser = () => useAtom(User)
export const login = atom (false)

export const getLogin = () => useAtom(login)