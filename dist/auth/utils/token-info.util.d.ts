import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from '../session.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
export declare function getTokenInfo(request: Request, jwtService: JwtService): JwtPayload;
export declare function getVerifiedTokenInfo(request: Request, sessionService: SessionService): Promise<JwtPayload>;
