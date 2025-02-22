import { networkInterfaces } from 'os';

export const getMacAddress = async (): Promise<string> => {
  const interfaces = networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    const networkInterface = interfaces[name];
    
    if (networkInterface) {
      for (const net of networkInterface) {
        // Skip internal interfaces and IPv6
        if (!net.internal && net.family === 'IPv4') {
          return net.mac;
        }
      }
    }
  }
  
  throw new Error('No MAC address found');
};