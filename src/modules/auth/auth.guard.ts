import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "src/common/constants/guard.constans";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly _reflector: Reflector,
        private readonly _authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this._reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;
        const request = context.switchToHttp().getRequest();
        const token = await this._authService.extractTokenFromHeader(request);
        request['user'] = this._authService.parsePayload(token);
        return true;
    }
}