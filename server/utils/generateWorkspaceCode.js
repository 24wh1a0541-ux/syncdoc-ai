import { customAlphabet } from "nanoid";

// Avoids ambiguous characters (0/O, 1/I) for codes humans type by hand
const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const nanoid = customAlphabet(alphabet, 6);

export const generateWorkspaceCode = () => `SD-${nanoid()}`;
