import { Client } from 'pg';
import { addWeek } from './addWeek';

export async function handler(event: any) {
    addWeek(event);
}



