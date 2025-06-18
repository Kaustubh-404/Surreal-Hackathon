
import axios from 'axios';
import { ENV } from '../config/env';

interface IPMetadata {
  name: string;
  description: string;
  imageHash?: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

interface PinataPinResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export const uploadImageToIPFS = async (file: File): Promise<string> => {
  if (!ENV.PINATA_JWT) {
    throw new Error('Pinata JWT is not configured. Please set VITE_PINATA_JWT in your environment variables.');
  }

  if (!ENV.PINATA_JWT.startsWith('eyJ') || ENV.PINATA_JWT.length < 100) {
    throw new Error('Invalid Pinata JWT format. Please verify VITE_PINATA_JWT.');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post<PinataPinResponse>(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          Authorization: `Bearer ${ENV.PINATA_JWT}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data;
      console.error('Error uploading file to IPFS:', error.message);
      console.error('Response data:', errorData);
      console.error('Response status:', status);
      const errorMessage =
        status === 401
          ? 'Unauthorized - Invalid or expired Pinata JWT. Please verify VITE_PINATA_JWT.'
          : error.message;
      throw new Error(`Failed to upload file to IPFS: ${errorMessage}`);
    }
    throw new Error('Failed to upload file to IPFS: Unknown error');
  }
};

export const uploadJSONToIPFS = async (jsonData: object): Promise<string> => {
  if (!ENV.PINATA_JWT) {
    throw new Error('Pinata JWT is not configured. Please set VITE_PINATA_JWT in your environment variables.');
  }

  if (!ENV.PINATA_JWT.startsWith('eyJ') || ENV.PINATA_JWT.length < 100) {
    throw new Error('Invalid Pinata JWT format. Please verify VITE_PINATA_JWT.');
  }

  try {
    const response = await axios.post<PinataPinResponse>(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      jsonData,
      {
        headers: {
          Authorization: `Bearer ${ENV.PINATA_JWT}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data;
      console.error('Error uploading JSON to IPFS:', error.message);
      console.error('Response data:', errorData);
      console.error('Response status:', status);
      const errorMessage =
        status === 401
          ? 'Unauthorized - Invalid or expired Pinata JWT. Please verify VITE_PINATA_JWT.'
          : error.message;
      throw new Error(`Failed to upload JSON to IPFS: ${errorMessage}`);
    }
    throw new Error('Failed to upload JSON to IPFS: Unknown error');
  }
};

export const uploadTextToIPFS = async (text: string): Promise<string> => {
  if (!ENV.PINATA_JWT) {
    throw new Error('Pinata JWT is not configured. Please set VITE_PINATA_JWT in your environment variables.');
  }

  if (!ENV.PINATA_JWT.startsWith('eyJ') || ENV.PINATA_JWT.length < 100) {
    throw new Error('Invalid Pinata JWT format. Please verify VITE_PINATA_JWT.');
  }

  try {
    const blob = new Blob([text], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', blob, 'evidence.txt');

    const response = await axios.post<PinataPinResponse>(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          Authorization: `Bearer ${ENV.PINATA_JWT}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data;
      console.error('Error uploading text to IPFS:', error.message);
      console.error('Response data:', errorData);
      console.error('Response status:', status);
      const errorMessage =
        status === 401
          ? 'Unauthorized - Invalid or expired Pinata JWT. Please verify VITE_PINATA_JWT.'
          : error.message;
      throw new Error(`Failed to upload text to IPFS: ${errorMessage}`);
    }
    throw new Error('Failed to upload text to IPFS: Unknown error');
  }
};

export const createIPMetadata = (metadata: IPMetadata): IPMetadata => {
  return {
    name: metadata.name,
    description: metadata.description,
    imageHash: metadata.imageHash,
    attributes: metadata.attributes,
  };
};
