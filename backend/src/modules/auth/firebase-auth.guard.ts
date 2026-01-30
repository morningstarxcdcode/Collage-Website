import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Request } from 'express'; // Import Request from express

// Define a custom interface for the request object to include the 'user' property
interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>(); // Use the custom interface
    const token = request.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Initialize Firebase Admin if not already done (move this to a provider in production)
      if (!admin.apps.length) {
        // NOTE: In production, provide credential: admin.credential.cert(serviceAccount)
        admin.initializeApp();
      }

      const decodedToken = await admin.auth().verifyIdToken(token);
      request.user = decodedToken;
      return true;
    } catch {
      // Removed 'error' variable as it was not used in the throw message
      throw new UnauthorizedException('Invalid token');
    }
  }
}
