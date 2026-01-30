import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';

interface DigilockerTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

interface DigilockerUserDetails {
  digilockerid: string;
  name: string;
  dob?: string;
  gender?: string;
  mobile?: string;
}

@Injectable()
export class DigilockerService {
  private readonly logger = new Logger(DigilockerService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly callbackUrl: string;

  constructor(private configService: ConfigService) {
    this.clientId =
      this.configService.get<string>('DIGILOCKER_CLIENT_ID') ?? '';
    this.clientSecret =
      this.configService.get<string>('DIGILOCKER_CLIENT_SECRET') ?? '';
    this.callbackUrl =
      this.configService.get<string>('DIGILOCKER_CALLBACK_URL') ?? '';
  }

  getAuthUrl(): string {
    const state = 'some_random_state';
    return `https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize?response_type=code&client_id=${this.clientId}&redirect_uri=${this.callbackUrl}&state=${state}`;
  }

  async getAccessToken(code: string): Promise<DigilockerTokenResponse> {
    try {
      const response = await axios.post<DigilockerTokenResponse>(
        'https://digilocker.meripehchaan.gov.in/public/oauth2/1/token',
        null,
        {
          params: {
            code: code,
            grant_type: 'authorization_code',
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: this.callbackUrl,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      this.logger.error(
        'Failed to get DigiLocker access token',
        axiosError.response?.data ?? axiosError.message,
      );
      throw error;
    }
  }

  async getUserDetails(accessToken: string): Promise<DigilockerUserDetails> {
    try {
      const response = await axios.get<DigilockerUserDetails>(
        'https://digilocker.meripehchaan.gov.in/public/oauth2/1/user',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      this.logger.error(
        'Failed to get DigiLocker user details',
        axiosError.response?.data ?? axiosError.message,
      );
      throw error;
    }
  }

  async getIssuedDocuments(accessToken: string): Promise<string> {
    try {
      const response = await axios.get<string>(
        'https://digilocker.meripehchaan.gov.in/public/oauth2/2/xml/issued',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      this.logger.error(
        'Failed to get issued documents',
        axiosError.response?.data ?? axiosError.message,
      );
      throw error;
    }
  }

  async getFile(uri: string, accessToken: string): Promise<string> {
    try {
      const response = await axios.get<string>(
        `https://digilocker.meripehchaan.gov.in/public/oauth2/1/xml/${uri}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Failed to fetch file ${uri}`,
        axiosError.response?.data ?? axiosError.message,
      );
      throw error;
    }
  }
}
