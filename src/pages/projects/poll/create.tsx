import React from "react";
import { trpc } from "../../../utils/trpc";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";
import {
  CreateQuestionInputType,
  createQuestionValidator,
} from "../../../shared/create-question-validator";
import { useRouter } from "next/router";
import Head from "next/head";
import { GetServerSideProps } from "next";
import Link from "next/link";

const CreateQuestionForm = () => {
  const router = useRouter();
  const { user } = useUser();

  // const { mutate } = trpc.useMutation("questions.create", {
  //   onSuccess: (data) => {
  //     console.log(data);
  //     reset();
  //     router.push(`/projects/poll/q/${data.id}`);
  //   },
  // });
  const createMutation = trpc.question.createQuestion.useMutation({
    onSuccess(data) {
      console.log(data);
      reset();  
      router.push(`/projects/poll/q/${data.insertId}`);
    }
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
  if (!user)
  {
    return <h1>Loading... If it {"doesn't"} load try  <Link href="/sign-in" className="text-[#767dc1]">logging in again</Link></h1>;
  }
  return (
    <>
      <main className="mx-auto flex  w-screen flex-col items-center justify-center text-center text-xl text-white">
        <div className="">
          <form
            onSubmit={handleSubmit((data) => {
              createMutation.mutate({
                question: data.question,
                email: `${user.primaryEmailAddress?.emailAddress}`,
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
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);
 
  if (!userId) {
    // handle user is not logged in.
  }
 
  // Load any data your application needs for the page using the userId
  return { props: { ...buildClerkProps(ctx.req) } };
};