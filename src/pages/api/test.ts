import { z } from "zod";
import { db} from '../../db/client'
import { sql } from 'drizzle-orm'
import {vote} from '../../db/schema'
export default async function test() {
    const questions = await db.query.pollQuestion.findMany()
    console.log(questions)
}