import { useMutation, useSubscription } from "@apollo/client";
import * as models from "../../models";
import {
  ASSISTANT_MESSAGE_UPDATED,
  SEND_ASSISTANT_MESSAGE,
} from "../queries/assistantQueries";
import { useState } from "react";
import { useAppContext } from "../../context/appContext";

type TAssistantThreadData = {
  sendAssistantMessageWithStream: models.AssistantThread;
};

type TAssistantMessageUpdatedData = {
  assistantMessageUpdated: models.AssistantMessageDelta;
};

export type AssistantMessageWithOptions = models.AssistantMessage & {
  options?: string[];
};

const INITIAL_MESSAGE: AssistantMessageWithOptions = {
  text: `**Welcome! my name is Jovu.** 

  My goal is to assist you in building production-ready backend services easily and according to industry standards using Amplication. 
  This includes helping you navigate the features of Amplication, guiding you through the process of creating entities, services, configurations, and more within your projects. 
  
  You can ask me anything about Amplication, or use one of the following options to get started.`,

  role: models.EnumAssistantMessageRole.Assistant,
  id: "none",
  createdAt: "",
  options: [
    "How can I start?",
    "Can I customize the code generated by Amplication?",
    "Create two data models named 'airline' and 'flight'",
    "What else can I ask you?",
  ],
};

const useAssistant = () => {
  const { currentProject, currentResource, addBlock, commitUtils } =
    useAppContext();

  const [messages, setMessages] = useState<AssistantMessageWithOptions[]>([
    INITIAL_MESSAGE,
  ]);
  const [threadId, setThreadId] = useState<string | null>(null);

  const [
    sendAssistantMessage,
    { error: sendMessageError, loading: sendMessageLoading },
  ] = useMutation<TAssistantThreadData>(SEND_ASSISTANT_MESSAGE, {
    onCompleted: (data) => {
      setThreadId(data.sendAssistantMessageWithStream.id);
      setMessages([
        ...messages,
        ...data.sendAssistantMessageWithStream.messages,
      ]);
      //@todo: update client side data smartly based on the actions on the server
      addBlock("blockid");
      commitUtils.refetchCommitsData(true);
    },
  });

  const { error: streamError } = useSubscription<TAssistantMessageUpdatedData>(
    ASSISTANT_MESSAGE_UPDATED,
    {
      variables: {
        threadId,
      },
      skip: !threadId,
      onData: (data) => {
        const message = data.data.data.assistantMessageUpdated;

        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          lastMessage.text = message.snapshot;
          return [...messages];
        });
      },
    }
  );

  const sendMessage = (message: string) => {
    setMessages([
      ...messages,
      {
        text: message,
        role: models.EnumAssistantMessageRole.User,
        id: Date.now().toString(),
        createdAt: "",
      },
      {
        text: "Thinking...",
        role: models.EnumAssistantMessageRole.Assistant,
        id: Date.now().toString() + "_",
        createdAt: "",
      },
    ]);

    sendAssistantMessage({
      variables: {
        data: {
          message,
          threadId,
        },
        context: {
          projectId: currentProject?.id,
          resourceId: currentResource?.id,
        },
      },
    }).catch((error) => {
      console.error(error);
    });
  };

  return {
    sendMessage,
    messages,
    sendMessageError,
    sendMessageLoading,
    streamError,
  };
};

export default useAssistant;
