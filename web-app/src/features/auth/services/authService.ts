import apiClient from '../../../core/api/apiClient';
import { LoginResponse } from '../../../shared/types/auth.types';
import { RegisterRequest } from '../../../shared/types/auth.types';

// ============================================================================
// CONFIGURAÇÃO DE AMBIENTE: INTEGRANDO COM A API REAL
// ============================================================================
// Para se conectar à sua API real (.NET 10 Identity/Gateway Service):
// 1. Configure a URL da sua API no arquivo `.env` como `COUPLEHUB_API_URL` (ex: COUPLEHUB_API_URL=http://localhost:5000)
// ============================================================================


export const authService = {
  /**
   * Realiza a tentativa de login do usuário.
   * @param email E-mail do usuário.
   * @param password Senha em texto simples.
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {


    // Chamada HTTP real para a rota correspondente no BFF/Gateway.
    // Exemplo: POST http://localhost:5000/api/v1/auth/login
    const response = await apiClient.post<LoginResponse>('/api/v1/auth/login', {
      email,
      password
    });
    return response.data;
  },

  /**
   * Realiza a tentativa de cadastro do usuário.
   * @param name Nome do usuário.
   * @param username Username do usuário.
   * @param birthDate Data de nascimento do usuário.
   * @param password Senha em texto simples.
   */
  register: async (user: RegisterRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/v1/auth/register', user);
    return response.data;
  }
};
