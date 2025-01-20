import dotenv from "dotenv";

// Carrega as variáveis de ambiente
dotenv.config();

// Exporta as variáveis para serem usadas em outros módulos
const env = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET, // Adiciona JWT_SECRET
};

export default env;
