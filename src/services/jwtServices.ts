import * as crypto from 'node:crypto';

interface JwtPayload {
  uid: string;
}

/**
 * Interface for JSON Web Token (JWT) utility.
 */
export interface IJwt {
  /**
   * Encodes the given payload into a JWT string.
   *
   * @param payload - The payload to encode as a JWT.
   * @returns The JWT string.
   */
  encode(payload: JwtPayload): string;

  /**
   * Decodes a JWT string, returning the original payload if the signature is valid.
   *
   * @param token - The JWT string to decode.
   * @returns The decoded payload as an object.
   * @throws Error if the token format is invalid or the signature is incorrect.
   */
  decode(token: string): JwtPayload;
}

/**
 * Classe Jwt permettant de gérer la génération et la vérification des JSON Web Tokens (JWT).
 *
 * Un JWT est un jeton sécurisé composé de trois parties : un header, un payload, et une signature.
 * La signature est utilisée pour vérifier que le contenu du JWT n'a pas été modifié.
 *
 * ```
 * 1. [Front-End]                             2. [Back-End]
 *    ┌──────────┐                           ┌─────────────┐
 *    │          │── Login (username/pwd) ──▶│             │
 *    │  Client  │                           │  Serveur    │
 *    └──────────┘                           └─────────────┘
 *                                              │
 *                                              │
 *              3. Génération du JWT            │
 *                                              ▼
 *                                      ┌──────────────────┐
 *                                      │  Création du     │
 *                                      │  JWT avec info   │
 *                                      │ utilisateur(uid) │
 *                                      └──────────────────┘
 *                                              │
 *                                              │
 *         4. Envoi du JWT au front             │
 *                                              ▼
 *    ┌──────────┐                       ┌─────────────┐
 *    │          │◀─── Retourne JWT ─────│             │
 *    │  Client  │                       │  Serveur    │
 *    └──────────┘                       └─────────────┘
*
 *    ┌──────────────────────────────────────────────────────┐
 * 5. │ Le client stocke le JWT dans son stockage local      │
 *    │ (ex. LocalStorage, session storage) pour usage futur │
 *    └──────────────────────────────────────────────────────┘
*
*
6. Accès aux ressources protégées :
     ┌──────────┐                           ┌─────────────┐
     │          │── Requête avec JWT ──────▶│             │
     │  Client  │  Authorization: Bearer    │  Serveur    │
     │          │        <token>            │             │
     └──────────┘                           └─────────────┘
                                               │
                                               │
     7. Vérification du JWT                    │
                                               ▼
                                       ┌──────────────────┐
                                       │  Décodage du JWT │
                                       │  et validation   │
                                       │  de la signature │
                                       └──────────────────┘
                                               │
                                               │
     8. Si valide, accès accordé               │
                                               ▼
     ┌──────────┐                       ┌─────────────┐
     │          │◀── Réponse ou donnée ─│             │
     │  Client  │                       │  Serveur    │
     └──────────┘                       └─────────────┘

Si le token est invalide ou expiré, le serveur retourne une erreur d'authentification.


 * ```
 *
 * Exemple d'utilisation :
 *
 * 1. Génération d'un token pour authentifier un utilisateur :
 *    ```typescript
 *    import jwt from './jwtServices';
 *
 *    const token = jwt.encode({ uid });
 *    ```
 *
 * 2. Vérification d'un token pour sécuriser l'accès à une route :
 *    ```typescript
 *    try {
 *      const payload = jwt.decode(token); // Récupère les données si le token est valide
 *      console.log(payload.uid); // Accès aux données de l'utilisateur
 *    } catch (error) {
 *      console.error('Token invalide'); // Gestion d'une erreur si le token est incorrect
 *    }
 *    ```
 *
 * Cette classe encode le header et le payload en base64, puis les signe avec une clé secrète.
 * La vérification du token compare la signature calculée à celle fournie, pour s'assurer que le contenu n'a pas changé.
 */
class JwtServices implements IJwt {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  private base64URLEncode(text: string): string {
    return Buffer.from(text)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private base64URLDecode(text: string): string {
    const base64 = text.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(base64, 'base64').toString('utf-8');
  }

  public encode(payload: JwtPayload): string {
    const header = this.base64URLEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadEncoded = this.base64URLEncode(JSON.stringify(payload));
    const signature = this.base64URLEncode(
      crypto
        .createHmac('sha256', this.secret)
        .update(`${header}.${payloadEncoded}`)
        .digest('binary'),
    );

    return `${header}.${payloadEncoded}.${signature}`;
  }

  public decode(token: string): JwtPayload {
    const parts = token.match(/^(?<header>.+)\.(?<payload>.+)\.(?<signature>.+)$/);
    if (!parts || !parts.groups) {
      throw new Error('Invalid token format');
    }

    const { header, payload, signature } = parts.groups;
    const validSignature = crypto
      .createHmac('sha256', this.secret)
      .update(`${header}.${payload}`)
      .digest('binary');
    const decodedSignature = this.base64URLDecode(signature);

    if (
      !crypto.timingSafeEqual(
        Buffer.from(validSignature, 'binary'),
        Buffer.from(decodedSignature, 'binary'),
      )
    ) {
      throw new Error('Invalid token signature');
    }

    return JSON.parse(this.base64URLDecode(payload));
  }
}

export default new JwtServices(process.env.SECRET);
