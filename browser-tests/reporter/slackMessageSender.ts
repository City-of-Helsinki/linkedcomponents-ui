import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook';

import { bold, codeBlock } from './utils/slackTextFormatters';

type SlackMessageSender = {
  addMessage: (message: string) => void;
  addErrorMessage: (message: string) => void;
  sendMessage: (
    message: string,
    sendArguments?: IncomingWebhookSendArguments
  ) => Promise<void>;
  sendTestReport: (amountOfFailedTests: number) => Promise<void>;
};

/**
 * Based on https://www.charactercountonline.com/ it seems that slack message accepts maximum of 7200 characters
 */
const SLACK_MESSAGE_MAX_LENGTH = 7_200;

export const createSlackMessageSender = (): SlackMessageSender => {
  const url = process.env.TESTCAFE_SLACK_WEBHOOK ?? '';
  const webhook = new IncomingWebhook(url);

  const channel = process.env.TESTCAFE_SLACK_CHANNEL;
  const username = process.env.TESTCAFE_SLACK_USERNAME;
  const messages: string[] = [];
  const errorMessages: string[] = [];

  const addMessage = (message: string) => {
    messages.push(message);
  };

  const addErrorMessage = (errorMessage: string) => {
    // error message length might exceed max limit of slack message. Minus six (-6) is because of codeBlock size.
    const msg = errorMessage.substring(0, SLACK_MESSAGE_MAX_LENGTH - 6);
    errorMessages.push(codeBlock(msg));
  };

  const sendMessage = async (
    message: string,
    sendArguments: IncomingWebhookSendArguments = {}
  ) => {
    try {
      await webhook.send({
        channel,
        username,
        text: message,
        ...sendArguments,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Unable to send a message to slack', e.stack);
    }
  };

  const sendTestReport = async (amountOfFailedTests: number) => {
    // send report only when something has failed
    const message = messages.join('\n');
    if (amountOfFailedTests > 0) {
      await sendMessage(
        message,
        amountOfFailedTests
          ? {
              attachments: [
                ...errorMessages.map((msg) => ({ color: 'danger', text: msg })),
                {
                  color: 'danger',
                  text: bold(`${amountOfFailedTests} test failed!`),
                },
              ],
            }
          : undefined
      );
    }
  };

  return {
    addMessage,
    addErrorMessage,
    sendMessage,
    sendTestReport,
  };
};
