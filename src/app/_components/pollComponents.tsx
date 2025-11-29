"use client";
import { api } from "~/trpc/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import copy from "copy-to-clipboard";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/app/_components/ui/input";
import {
  type CreateQuestionInputType,
  createQuestionValidator,
} from "~/shared/create-question-validator";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
export function DeletePoll(props: { id: number, email: string }) {
  const deleteMutation = api.question.deleteQuestion.useMutation();
  return (
    <button
      className="ml-2 items-center text-2xl font-bold text-accent hover:cursor-crosshair"
      onClick={() => {
        deleteMutation.mutate({
          id: props.id,
          email: props.email
        });
      }}
    >
      Delete
    </button>
  );
}
function getRandomPlaceHolder(): string {
  const placeholders = ["Yes","No","I don't know","Maybe","Maybe yes", "Maybe no","Gaming","Programming","Answer","Option"]
  return placeholders[Math.floor(Math.random()*placeholders.length)]!;
}
export function CopyUrl(props: { id: number }) {
  const CopyUrl = async (event: React.SyntheticEvent) => {
    const rowId = event.currentTarget.id;
    copy(`https://wiktrek.xyz/q/${rowId}`);
    toast("Link copied!");
  };
  return (
    <button className="pr-1 pl-2" onClick={CopyUrl} id={`${props.id}`}>
      <FontAwesomeIcon icon={faClipboard as IconProp} />
    </button>
  );
}
export function FormComponent(props: { email: string }) {
  const router = useRouter();
  const createMutation = api.question.createQuestion.useMutation({
    async onSuccess(data) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      reset();
      if (!data[0]) return;
      router.push(`/poll/q/${data[0].insertedId}`);
      toast("Question has been created.");
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
  const [random,setRandom] = useState([] as string[]);
  useEffect(() => {
    let r = [];
    for (let i = 0;i<10;i++) {
      r.push(getRandomPlaceHolder())
    }
    setRandom(r);
  },[])
  watch("question");
  watch("options");
  return (
    <form
      onSubmit={handleSubmit((data) => {
        createMutation.mutate({
          question: data.question,
          email: `${props.email}`,
          options: data.options,
        });
      })}
      className="w-80"
    >
      <label className="grid pb-2 text-left">
        <span className="mb-2 text-primary font-semibold text-2xl">Question</span>
        <Input
          {...register("question")}
          type="text"
          placeholder="How do magnets work?"
          className="w-72"
        />
      </label>
      <label className="grid pb-2 text-left">
        <span className="mb-2 text-primary font-semibold text-2xl ">Options</span>
        {fields.map((field, index) => {
          return (
            <div key={field.id}>
              <section className="flex pt-1" key={field.id}>
                <Input
                className="h-12 text-5xl font-bold"
                placeholder={random[random.length % index]}
                {...register(`options.${index}.text`, {
                  required: true,
                })}
                />
                <button
                  className="pl-2 font-extrabold text-2xl text-accent"
                  type="button"
                  onClick={() => remove(index)}
                >
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
          onClick={() => append({ text: "" })}
          className="text-2xl font-semibold text-accent"
        >
          Add option
        </button>
      </div>
      {errors.options && <p id="error">{`${errors.options?.message == undefined ? "" : errors.options.message}`}</p>}
      {errors.question && <p id="error">{`${errors.question?.message}`}</p>}
      <button type="submit" className="text-ring hover:cursor-pointer hover:text-primary transition-all font-bold text-2xl">
        Create question
      </button>
    </form>
  );
}
function VoteOn(props: {
  questionId: number;
  option: { text: string; index: number };
  token: string;
}) {
  const { questionId, option, token } = props;
  const voteOnMutation = api.question.voteOn.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });
  return (
    <button
      onClick={() => {
        voteOnMutation.mutate({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          questionId,
          option: option.index,
          token,
        });
      }}
      className="text-2xl font-semibold text-primary"
    >
      {option.text}
    </button>
  );
}

export const QuestionPageContent: React.FC<{
  email: string;
  id: number;
}> = ({ email, id }) => {
  const [token, setToken] = useState<string>("");
  useEffect(() => {
    if (!localStorage.getItem("voterToken")) {
      localStorage.setItem("voterToken", v4());
    }
    setToken(localStorage.getItem("voterToken")!);
  }, []);
  const { isLoading, data } = api.question.getById.useQuery({
    email,
    token,
    id,
  });
  let isOwner = false;
  let totalVotes = 0;
  if (isLoading) {
    return <div className="flex text-center">Loading...</div>;
  }
  if (!data?.question || !data) {
    return <div>Question not found</div>;
  }
  interface Choice {
    count: number;
  }
  const getTotalVotes = (votes: Choice[]) => {
    votes?.map((choice: { count: number }) => {
      totalVotes += Number(choice.count);
    });
  };
  const getPercent = (voteCount: number) => {
    if (voteCount !== undefined && totalVotes > 0)
      return `${((voteCount / totalVotes) * 100).toFixed()}%`;
    else if (voteCount == undefined) return `0%`;
  };
  if (data && data != undefined) getTotalVotes(data.votes as Choice[]);
  if (email === data.question?.ownerEmail) isOwner = true;
  return (
    <>
      <main className="mx-auto flex w-screen flex-col items-center justify-center text-center text-xl text-white">
        <div className="">
          <div className="">
            <p className="text-3xl font-semibold">{data.question?.question}</p>
            {(data.question?.options as { text: string }[])?.map(
              (option, index) => {
                if (isOwner || data.vote != undefined) {
                  return (
                    <div className="" key={index}>
                      <p className="text-left text-primary font-semibold">
                        {getPercent(data?.votes?.[index]?.count ?? 0)} {` `}
                        {option.text} - {data?.votes?.[index]?.count ?? 0} {` `}
                      </p>
                    </div>
                  );
                }
                return (
                  <div className="" key={index}>
                    <VoteOn
                      questionId={data?.question!.id}
                      option={{ index: index, text: option.text }}
                      token={token}
                    />
                  </div>
                );
              },
            )}
          </div>
          {isOwner && <p className="text-accent">This is your poll</p>}
        </div>
      </main>
    </>
  );
};
