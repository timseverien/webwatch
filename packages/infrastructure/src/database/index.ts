import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

export type DatabaseClient = PrismaClient;

export function createClient(): DatabaseClient {
	return new PrismaClient();
}
