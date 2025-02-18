import { Logic, LogicCondition, Question } from "@formbricks/types/questions";
import { Survey } from "@formbricks/types/surveys";
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@formbricks/ui";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";
import { ChevronDown, SplitIcon } from "lucide-react";
import { useMemo } from "react";
import { BsArrowDown, BsArrowReturnRight } from "react-icons/bs";

interface LogicEditorProps {
  localSurvey: Survey;
  questionIdx: number;
  question: Question;
  updateQuestion: (questionIdx: number, updatedAttributes: any) => void;
}

type LogicConditions = {
  [K in LogicCondition]: {
    label: string;
    values: string[] | null;
    unique?: boolean;
    multiSelect?: boolean;
  };
};

export default function LogicEditor({
  localSurvey,
  question,
  questionIdx,
  updateQuestion,
}: LogicEditorProps): JSX.Element {
  const questionValues = useMemo(() => {
    if ("choices" in question) {
      return question.choices.map((choice) => choice.label);
    } else if ("range" in question) {
      return Array.from({ length: question.range }, (_, i) => (i + 1).toString());
    } else if (question.type === "nps") {
      return Array.from({ length: 11 }, (_, i) => (i + 0).toString());
    }
    return [];
  }, [question]);

  const conditions = {
    openText: ["submitted", "skipped"],
    multipleChoiceSingle: ["submitted", "skipped", "equals", "notEquals"],
    multipleChoiceMulti: ["submitted", "skipped", "includesAll", "includesOne", "equals"],
    nps: [
      "equals",
      "notEquals",
      "lessThan",
      "lessEqual",
      "greaterThan",
      "greaterEqual",
      "submitted",
      "skipped",
    ],
    rating: [
      "equals",
      "notEquals",
      "lessThan",
      "lessEqual",
      "greaterThan",
      "greaterEqual",
      "submitted",
      "skipped",
    ],
    cta: ["submitted", "skipped"],
  };
  const logicConditions: LogicConditions = {
    submitted: {
      label: "is submitted",
      values: null,
      unique: true,
    },
    skipped: {
      label: "is skipped",
      values: null,
      unique: true,
    },
    equals: {
      label: "equals",
      values: questionValues,
    },
    notEquals: {
      label: "does not equal",
      values: questionValues,
    },
    lessThan: {
      label: "is less than",
      values: questionValues,
    },
    lessEqual: {
      label: "is less or equal to",
      values: questionValues,
    },
    greaterThan: {
      label: "is greater than",
      values: questionValues,
    },
    greaterEqual: {
      label: "is greater or equal to",
      values: questionValues,
    },
    includesAll: {
      label: "includes all of",
      values: questionValues,
      multiSelect: true,
    },
    includesOne: {
      label: "includes one of",
      values: questionValues,
      multiSelect: true,
    },
  };

  // useEffect(() => {
  //   console.log(question);
  // }, [question]);

  const addLogic = () => {
    const newLogic: Logic[] = !question.logic ? [] : question.logic;
    newLogic.push({
      condition: undefined,
      value: undefined,
      destination: undefined,
    });
    updateQuestion(questionIdx, { logic: newLogic });
  };

  const updateLogic = (logicIdx: number, updatedAttributes: any) => {
    const currentLogic: any = question.logic ? question.logic[logicIdx] : undefined;
    if (!currentLogic) return;

    // clean logic value if not needed or if condition changed between multiSelect and singleSelect conditions
    const updatedCondition = updatedAttributes?.condition;
    const currentCondition = currentLogic?.condition;
    const updatedLogicCondition = logicConditions[updatedCondition];
    const currentLogicCondition = logicConditions[currentCondition];
    if (updatedCondition) {
      if (updatedLogicCondition?.multiSelect && !currentLogicCondition?.multiSelect) {
        updatedAttributes.value = [];
      } else if (
        (!updatedLogicCondition?.multiSelect && currentLogicCondition?.multiSelect) ||
        updatedLogicCondition?.values === null
      ) {
        updatedAttributes.value = undefined;
      }
    }

    const newLogic = !question.logic
      ? []
      : question.logic.map((logic, idx) => {
          if (idx === logicIdx) {
            return { ...logic, ...updatedAttributes };
          }
          return logic;
        });

    updateQuestion(questionIdx, { logic: newLogic });
  };

  const updateMultiSelectLogic = (logicIdx: number, checked: boolean, value: string) => {
    const newLogic = !question.logic
      ? []
      : question.logic.map((logic, idx) => {
          if (idx === logicIdx) {
            const newValues = !logic.value ? [] : logic.value;
            if (checked) {
              newValues.push(value);
            } else {
              newValues.splice(newValues.indexOf(value), 1);
            }
            return { ...logic, value: Array.from(new Set(newValues)) };
          }
          return logic;
        });

    updateQuestion(questionIdx, { logic: newLogic });
  };

  const deleteLogic = (logicIdx: number) => {
    const newLogic = !question.logic
      ? []
      : (question.logic as Logic[]).filter((_: any, idx: number) => idx !== logicIdx);
    updateQuestion(questionIdx, { logic: newLogic });
  };

  const truncate = (str: string, n: number) =>
    str && str.length > n ? str.substring(0, n - 1) + "..." : str;

  if (!(question.type in conditions)) {
    return <></>;
  }

  return (
    <div className="mt-3">
      <Label>Logic Jumps</Label>

      {question?.logic && question?.logic?.length !== 0 && (
        <div className="mt-2 space-y-3">
          {question?.logic?.map((logic, logicIdx) => (
            <div key={logicIdx} className="flex items-center space-x-2 space-y-1 text-sm">
              <BsArrowReturnRight className="h-4 w-4" />
              <p>If this answer</p>

              <Select
                defaultValue={logic.condition}
                onValueChange={(e) => updateLogic(logicIdx, { condition: e })}>
                <SelectTrigger className="min-w-fit flex-1">
                  <SelectValue placeholder="select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions[question.type].map(
                    (condition) =>
                      !(question.required && condition === "skipped") && (
                        <SelectItem key={condition} value={condition}>
                          {logicConditions[condition].label}
                        </SelectItem>
                      )
                  )}
                </SelectContent>
              </Select>

              {logic.condition && logicConditions[logic.condition].values != null && (
                <div className="flex-1 basis-1/5">
                  {!logicConditions[logic.condition].multiSelect ? (
                    <Select
                      defaultValue={logic.value}
                      onValueChange={(e) => updateLogic(logicIdx, { value: e })}>
                      <SelectTrigger>
                        <SelectValue placeholder="select match type" />
                      </SelectTrigger>
                      <SelectContent>
                        {logicConditions[logic.condition].values?.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="z-10 cursor-pointer" asChild>
                        <div className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ">
                          {logic.value?.length === 0 ? (
                            <p className="text-slate-400">select match type</p>
                          ) : (
                            <p>{logic.value.join(", ")}</p>
                          )}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-40 bg-slate-50 text-slate-700"
                        align="start"
                        side="top">
                        {logicConditions[logic.condition].values?.map((value) => (
                          <DropdownMenuCheckboxItem
                            key={value}
                            checked={logic.value?.includes(value)}
                            onSelect={(e) => e.preventDefault()}
                            onCheckedChange={(e) => updateMultiSelectLogic(logicIdx, e, value)}>
                            {value}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              )}

              <p>skip to</p>

              <Select
                defaultValue={logic.destination}
                onValueChange={(e) => updateLogic(logicIdx, { destination: e })}>
                <SelectTrigger className="w-fit overflow-hidden ">
                  <SelectValue placeholder="select question" />
                </SelectTrigger>
                <SelectContent>
                  {localSurvey.questions.map(
                    (question, idx) =>
                      idx !== questionIdx && (
                        <SelectItem key={question.id} value={question.id}>
                          {idx + 1} - {truncate(question.headline, 14)}
                        </SelectItem>
                      )
                  )}
                  <SelectItem value="end">End of survey</SelectItem>
                </SelectContent>
              </Select>

              <TrashIcon
                className="ml-2 h-4 w-4 cursor-pointer text-slate-400"
                onClick={() => deleteLogic(logicIdx)}
              />
            </div>
          ))}
          <div className="flex flex-wrap items-center space-x-2 py-1 text-sm">
            <BsArrowDown className="h-4 w-4" />
            <p>All other answers will continue to the next question</p>
          </div>
        </div>
      )}

      <div className="mt-2 flex items-center space-x-2">
        <Button
          id="logicJumps"
          type="button"
          name="logicJumps"
          variant="secondary"
          StartIcon={SplitIcon}
          onClick={() => addLogic()}>
          Add Logic
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <QuestionMarkCircleIcon className="h-5 w-5 cursor-default" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px]" side="top">
              With logic jumps you can skip questions based on the responses users give.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
