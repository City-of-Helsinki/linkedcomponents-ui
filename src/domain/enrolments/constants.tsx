import { IconCrossCircle, IconEnvelope, IconPen } from 'hds-react';

export enum ENROLMENT_EDIT_ACTIONS {
  CANCEL = 'cancel',
  EDIT = 'edit',
  SEND_MESSAGE = 'sendMessage',
  UPDATE = 'update',
}

export const ENROLMENT_EDIT_ICONS = {
  [ENROLMENT_EDIT_ACTIONS.CANCEL]: <IconCrossCircle />,
  [ENROLMENT_EDIT_ACTIONS.EDIT]: <IconPen />,
  [ENROLMENT_EDIT_ACTIONS.SEND_MESSAGE]: <IconEnvelope />,
  [ENROLMENT_EDIT_ACTIONS.UPDATE]: <IconPen />,
};

export const ENROLMENT_EDIT_LABEL_KEYS = {
  [ENROLMENT_EDIT_ACTIONS.CANCEL]: 'enrolmentsPage.actionButtons.cancel',
  [ENROLMENT_EDIT_ACTIONS.EDIT]: 'enrolmentsPage.actionButtons.edit',
  [ENROLMENT_EDIT_ACTIONS.SEND_MESSAGE]:
    'enrolmentsPage.actionButtons.sendMessage',
  [ENROLMENT_EDIT_ACTIONS.UPDATE]: 'enrolment.form.buttonSave',
};

export const AUTHENTICATION_NOT_NEEDED = [ENROLMENT_EDIT_ACTIONS.EDIT];

export const ENROLMENTS_PAGE_SIZE = 10;
