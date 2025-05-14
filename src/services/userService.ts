
import { User, UserCredentials, UserRegistration } from "@/types/User";
import { v4 as uuidv4 } from "uuid";

const USERS_STORAGE_KEY = "meuBolsoFuturo_users";

// Inicializa o usuário padrão se não existirem usuários
const initializeDefaultUser = (): void => {
  const users = getUsers();
  
  if (users.length === 0) {
    const defaultUser: User = {
      id: uuidv4(),
      email: "admin@example.com",
      password: "1234554321",
      name: "Administrador",
      createdAt: new Date()
    };
    
    saveUsers([defaultUser]);
  }
};

// Recupera todos os usuários armazenados
export const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  if (!usersJson) return [];
  
  try {
    const users = JSON.parse(usersJson);
    return users.map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt)
    }));
  } catch (error) {
    console.error("Erro ao recuperar usuários:", error);
    return [];
  }
};

// Salva a lista de usuários
const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Autentica um usuário
export const authenticateUser = ({ email, password }: UserCredentials): User | null => {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  
  return user || null;
};

// Registra um novo usuário
export const registerUser = ({ name, email, password }: UserRegistration): User | null => {
  const users = getUsers();
  
  // Verifica se já existe um usuário com o mesmo email
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return null;
  }
  
  const newUser: User = {
    id: uuidv4(),
    email,
    password,
    name,
    createdAt: new Date()
  };
  
  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
  
  return newUser;
};

// Inicializa o sistema com o usuário padrão
initializeDefaultUser();
