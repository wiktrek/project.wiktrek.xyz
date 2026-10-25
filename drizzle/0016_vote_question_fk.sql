-- Deleting a poll now deletes its votes instead of leaving them orphaned.
ALTER TABLE "Vote"
  ADD CONSTRAINT "Vote_questionId_PollQuestion_id_fk"
  FOREIGN KEY ("questionId") REFERENCES "PollQuestion"("id") ON DELETE CASCADE;
