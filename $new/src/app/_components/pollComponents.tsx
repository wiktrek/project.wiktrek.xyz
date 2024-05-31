"use client"
import { api } from "~/trpc/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner"
import copy from "copy-to-clipboard";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/app/_components/ui/input"
import { 
  type CreateQuestionInputType,
  createQuestionValidator,
} from "~/shared/create-question-validator";

export function DeletePoll(props: { id: number}) {
  const deleteMutation = api.question.deleteQuestion.useMutation()
    return (
    <button 
        className="text-lg" onClick={() => {
            deleteMutation.mutate({
                id: props.id,
            });
        }}>
    Delete
    </button>
    )
}
export function CopyUrl(props: { id: number}) {
  const CopyUrl = async (event: React.SyntheticEvent) => {
    const rowId = event.currentTarget.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    copy(`https://wiktrek.xyz/q/${rowId}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    toast("Link copied!")
  };
    return (
        <button className="pl-2 pr-1" onClick={CopyUrl} id={`${props.id}`}>
           <FontAwesomeIcon icon={faClipboard}/>
        </button>
    )
}
export function FormComponent(props: { email: string}) {
  const router = useRouter();
  const createMutation = api.question.createQuestion.useMutation({
    async onSuccess(data) {
      console.log(data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      reset();
      if (!data[0]) return;
      router.push(`/projects/poll/q/${data[0].insertedId}`);
    toast("Question has been created.")
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
  return (
    <form
            onSubmit={handleSubmit((data) => {
              createMutation.mutate({
                question: data.question,
                email: `${props.email}`,
                options: data.options,
              });
            })}
            className=""
          >
            <label className="grid pb-2">
              <span>Question</span>
              <Input
                {...register("question")}
                type="text"
                placeholder="How do magnets work?"

              />
            </label>
            <label>
              {fields.map((field, index) => {
                return (
                  <div key={field.id}>
                    <section className="flex pt-1" key={field.id}>
                      <Input
                        placeholder="Option"
                        {...register(`options.${index}.text`, {
                          required: true,
                        })}
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
            <button type="submit" className="text-ring">
              Create question
            </button>
        </form>
  )
}
export function VoteOn(props: { questionId: number, option: number, token: string}) {
  const { questionId, option, token } = props
  const voteOnMutation = api.question.voteOn.useMutation({
    onSuccess: () => {
      // console.log("WORKS!!!")
      window.location.reload();
    }
  });
  return (
    <button
      onClick={() => {
        voteOnMutation.mutate({
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          questionId,
          option,
          token,
        });
      }}
  >
    {option}
  </button>
  )
}
