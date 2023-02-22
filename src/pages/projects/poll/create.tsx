import React from "react";
import { trpc } from "../../../utils/trpc";
import { useUser } from "@auth0/nextjs-auth0";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateQuestionInputType,
  createQuestionValidator,
} from "../../../shared/create-question-validator";
import { useRouter } from "next/router";
import Head from "next/head";

const CreateQuestionForm = () => {
  const router = useRouter();
  const { user } = useUser();

  const { mutate } = trpc.useMutation("questions.create", {
    onSuccess: (data) => {
      console.log(data);
      reset();
      router.push(`/projects/poll/q/${data.id}`);
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateQuestionInputType>({
    resolver: zodResolver(createQuestionValidator),
    defaultValues: {
      options: [{ text: "Yes" }, { text: "No" }],
    },
  });
  const { fields, append, remove } = useFieldArray<CreateQuestionInputType>({
    name: "options",
    control,
  });
  watch("question");
  watch("options");
  if (!user) return <a>not logged in</a>;

  if (typeof user.name !== "string") return <a>not logged in</a>;
  return (
    <>
      <main className="mx-auto flex  w-screen flex-col items-center justify-center text-center text-xl text-white">
        <div className="">
          <form
            onSubmit={handleSubmit((data) => {
              mutate({
                question: data.question,
                email: `${user.name}`,

                options: data.options,
              });
            })}
            className=""
          >
            <label className="grid">
              <span>Question</span>
              <input
                {...register("question")}
                type="text"
                className="bg-transparent text-white"
                placeholder="How do magnets work?"
              />
            </label>
            <label>
              {fields.map((field, index) => {
                return (
                  <div key={field.id}>
                    <section className={"section"} key={field.id}>
                      <input
                        placeholder="options"
                        {...register(`options.${index}.text`, {
                          required: true,
                        })}
                        className="bg-transparent text-white"
                      />
                      <button id="" type="button" onClick={() => remove(index)}>
                        X
                      </button>
                    </section>
                  </div>
                );
              })}
            </label>

            <div>
              <button
                id=""
                type="button"
                value="add more options "
                onClick={() => append({ text: "" })}
              >
                add more options
              </button>
            </div>
            {errors.options && <p id="error">{`${errors.options?.message}`}</p>}
            {errors.question && (
              <p id="error">{`${errors.question?.message}`}</p>
            )}
            <button type="submit" className="">
              Create question
            </button>
          </form>
        </div>
      </main>
    </>
  );
};
const QuestionCreator: React.FC = () => {
  return (
    <>
      <Head>
        <title>Poll create- wiktrek</title>
        <meta name="description" content="create a poll" />
      </Head>
      <CreateQuestionForm />
    </>
  );
};
export default QuestionCreator;
