import useMountedState from '../../../hooks/useMountedState';
import { KEYWORD_SET_ACTIONS } from '../constants';

type UseKeywordUpdateActionsState = {
  saving: KEYWORD_SET_ACTIONS | null;
  setSaving: (action: KEYWORD_SET_ACTIONS | null) => void;
};
const useKeywordSetUpdateActions = (): UseKeywordUpdateActionsState => {
  const [saving, setSaving] = useMountedState<KEYWORD_SET_ACTIONS | null>(null);

  return {
    saving,
    setSaving,
  };
};

export default useKeywordSetUpdateActions;
